
const db = require('../config/database');


// Place a new order (products: array of {productId, quantity})
exports.placeOrder = (req, res) => {
  const { userId, products, amount, paymentId, paymentMethod } = req.body;
  console.log('Placing order for userId:', userId, 'products:', products, 'amount:', amount, 'paymentId:', paymentId, 'paymentMethod:', paymentMethod);

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Products required' });
  }

  // Start transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error('Transaction begin error:', err);
      return res.status(500).json({ error: 'Transaction failed' });
    }

    // Step 1: Check stock availability for all products
    const checkStockPromises = products.map(product => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT stock FROM products WHERE id = ?';
        db.query(query, [product.productId], (err, results) => {
          if (err) return reject(err);
          if (results.length === 0) return reject(new Error(`Product ${product.productId} not found`));
          const availableStock = results[0].stock;
          if (availableStock < product.quantity) {
            return reject(new Error(`Insufficient stock for product ${product.productId}. Available: ${availableStock}, Requested: ${product.quantity}`));
          }
          resolve();
        });
      });
    });

    Promise.all(checkStockPromises)
      .then(() => {
        // Step 2: Insert order with payment method
        let status;
        if (paymentMethod === 'qr') {
          status = 'pending_payment';
        } else if (paymentMethod === 'cod') {
          status = 'confirmed'; // COD orders are confirmed immediately
        } else {
          status = 'pending'; // Razorpay
        }
        const orderQuery = 'INSERT INTO orders (user_id, amount, payment_id, status) VALUES (?, ?, ?, ?)';
        db.query(orderQuery, [userId, amount, paymentId || null, status], (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error('Order insert error:', err);
              res.status(500).json({ error: err.message });
            });
          }

          const orderId = result.insertId;

          // Step 3: Insert order items
          const orderItems = products.map(p => [orderId, p.productId, p.quantity]);
          const itemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES ?';
          db.query(itemsQuery, [orderItems], (err2) => {
            if (err2) {
              return db.rollback(() => {
                console.error('Order items insert error:', err2);
                res.status(500).json({ error: err2.message });
              });
            }

            // Step 4: Handle stock decrement based on payment method
            // COD and Razorpay: decrement stock immediately
            // QR: stock decremented after manual verification
            if (paymentMethod === 'razorpay' || paymentMethod === 'cod') {
              const updateStockPromises = products.map(product => {
                return new Promise((resolve, reject) => {
                  const updateQuery = 'UPDATE products SET stock = stock - ? WHERE id = ?';
                  db.query(updateQuery, [product.quantity, product.productId], (err, result) => {
                    if (err) return reject(err);
                    if (result.affectedRows === 0) return reject(new Error(`Failed to update stock for product ${product.productId}`));
                    resolve();
                  });
                });
              });

              Promise.all(updateStockPromises)
                .then(() => {
                  // Commit transaction
                  db.commit((err) => {
                    if (err) {
                      return db.rollback(() => {
                        console.error('Transaction commit error:', err);
                        res.status(500).json({ error: 'Transaction commit failed' });
                      });
                    }

                    const finalStatus = paymentMethod === 'cod' ? 'confirmed' : 'pending';
                    console.log(`${paymentMethod.toUpperCase()} Order placed successfully for userId:`, userId, 'orderId:', orderId);
                    res.status(201).json({
                      orderId,
                      userId,
                      products,
                      amount,
                      paymentId,
                      paymentMethod,
                      status: finalStatus,
                      message: paymentMethod === 'cod' ? 'Order confirmed. Pay cash on delivery.' : undefined
                    });
                  });
                })
                .catch((stockErr) => {
                  db.rollback(() => {
                    console.error('Stock update error:', stockErr);
                    res.status(500).json({ error: stockErr.message });
                  });
                });
            } else {
              // For QR payments, commit without decrementing stock
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Transaction commit error:', err);
                    res.status(500).json({ error: 'Transaction commit failed' });
                  });
                }

                console.log('QR Order placed successfully for userId:', userId, 'orderId:', orderId);
                res.status(201).json({
                  orderId,
                  userId,
                  products,
                  amount,
                  paymentId,
                  paymentMethod,
                  status: 'pending_payment',
                  message: 'Order placed. Please complete payment via QR code and contact admin for verification.'
                });
              });
            }
          });
        });
      })
      .catch((stockCheckErr) => {
        db.rollback(() => {
          console.error('Stock check error:', stockCheckErr);
          res.status(400).json({ error: stockCheckErr.message });
        });
      });
  });
};


// Get order history for a user with status
exports.getUserOrdersWithStatus = (req, res) => {
  const { userId } = req.params;
  console.log('Fetching orders for userId:', userId);
  
  // First check if table exists and has data
  const checkQuery = `
    SELECT o.id as orderId, o.amount, o.payment_id, o.created_at, o.status,
           oi.product_id, oi.quantity
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;
  
  db.query(checkQuery, [userId], (err, results) => {
    if (err) {
      console.error('Order fetch error:', err);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      return res.status(500).json({ 
        error: err.message,
        code: err.code,
        details: 'Failed to fetch orders from database'
      });
    }
    
    console.log('Orders fetched for userId:', userId, 'results count:', results.length);
    
    // If no results, return empty array
    if (!results || results.length === 0) {
      console.log('No orders found for userId:', userId);
      return res.json([]);
    }
    
    // Group by orderId
    const orders = {};
    results.forEach(row => {
      if (!orders[row.orderId]) {
        orders[row.orderId] = {
          orderId: row.orderId,
          amount: row.amount,
          paymentId: row.payment_id,
          createdAt: row.created_at,
          status: row.status,
          products: []
        };
      }
      if (row.product_id) {
        orders[row.orderId].products.push({
          productId: row.product_id,
          quantity: row.quantity
        });
      }
    });
    
    console.log('Grouped orders:', Object.values(orders));
    res.json(Object.values(orders));
  });
};

// Admin: get all orders, optionally filter by userId
exports.adminGetAllOrders = async (req, res) => {
  const { userId } = req.query;
  try {
    let query = `
      SELECT o.id AS orderId,
             o.user_id AS userId,
             o.amount,
             o.payment_id AS paymentId,
             o.status,
             o.created_at AS orderDate,
             u.name AS userName,
             u.email AS userEmail,
             u.mobile AS userMobile,
             ua.address,
             ua.city,
             ua.pincode,
             oi.product_id AS productId,
             oi.quantity,
             p.productName,
             p.productPrice
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      LEFT JOIN user_addresses ua ON ua.user_id = u.id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
    `;
    const params = [];
    if (userId) {
      query += ' WHERE o.user_id = ?';
      params.push(userId);
    }
    query += ' ORDER BY o.created_at DESC';

    const [rows] = await db.promise().query(query, params);
    if (!rows || rows.length === 0) {
      return res.json([]);
    }

    const orders = {};
    rows.forEach(row => {
      if (!orders[row.orderId]) {
        orders[row.orderId] = {
          orderId: row.orderId,
          userId: row.userId,
          amount: row.amount,
          paymentId: row.paymentId,
          status: row.status,
          orderDate: row.orderDate,
          user: {
            name: row.userName,
            email: row.userEmail,
            mobile: row.userMobile,
            address: row.address,
            city: row.city,
            pincode: row.pincode
          },
          products: []
        };
      }
      if (row.productId) {
        orders[row.orderId].products.push({
          productId: row.productId,
          productName: row.productName,
          productPrice: row.productPrice,
          quantity: row.quantity
        });
      }
    });

    res.json(Object.values(orders));
  } catch (err) {
    console.error('Admin order fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Admin: get single order by id
exports.adminGetOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const query = `
      SELECT o.id AS orderId,
             o.user_id AS userId,
             o.amount,
             o.payment_id AS paymentId,
             o.status,
             o.created_at AS orderDate,
             u.name AS userName,
             u.email AS userEmail,
             u.mobile AS userMobile,
             ua.address,
             ua.city,
             ua.pincode,
             oi.product_id AS productId,
             oi.quantity,
             p.productName,
             p.productPrice
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      LEFT JOIN user_addresses ua ON ua.user_id = u.id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
      WHERE o.id = ?
      ORDER BY o.created_at DESC
    `;
    const [rows] = await db.promise().query(query, [orderId]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = {
      orderId: rows[0].orderId,
      userId: rows[0].userId,
      amount: rows[0].amount,
      paymentId: rows[0].paymentId,
      status: rows[0].status,
      orderDate: rows[0].orderDate,
      user: {
        name: rows[0].userName,
        email: rows[0].userEmail,
        mobile: rows[0].userMobile,
        address: rows[0].address,
        city: rows[0].city,
        pincode: rows[0].pincode
      },
      products: []
    };

    rows.forEach(row => {
      if (row.productId) {
        order.products.push({
          productId: row.productId,
          productName: row.productName,
          productPrice: row.productPrice,
          quantity: row.quantity
        });
      }
    });

    res.json(order);
  } catch (err) {
    console.error('Admin get order error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Admin: update order status or payment details
exports.adminUpdateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { status, paymentId, amount } = req.body;
  const updates = [];
  const values = [];

  if (status) {
    updates.push('status = ?');
    values.push(status);
  }
  if (paymentId !== undefined) {
    updates.push('payment_id = ?');
    values.push(paymentId);
  }
  if (amount !== undefined) {
    updates.push('amount = ?');
    values.push(amount);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields provided for update' });
  }

  try {
    const [result] = await db.promise().query(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, [...values, orderId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order updated successfully' });
  } catch (err) {
    console.error('Admin update order error:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Admin: delete order and its items
exports.adminDeleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const [result] = await db.promise().query('DELETE FROM orders WHERE id = ?', [orderId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Admin delete order error:', err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};
