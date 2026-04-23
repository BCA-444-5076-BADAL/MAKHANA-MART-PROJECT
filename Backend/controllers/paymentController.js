const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: amount * 100, // amount in paise (for INR)
      currency,
      receipt: `order_rcptid_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify payment and update order status
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified successfully
      // Update order status to 'paid'
      const db = require('../config/database');
      const updateQuery = 'UPDATE orders SET status = ? WHERE payment_id = ?';
      db.query(updateQuery, ['paid', razorpay_payment_id], (err, result) => {
        if (err) {
          console.error('Order status update error:', err);
          return res.status(500).json({ error: 'Failed to update order status' });
        }

        res.json({
          success: true,
          message: "Payment verified and order status updated successfully",
          payment_id: razorpay_payment_id
        });
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get QR code for payment
exports.getQRCode = (req, res) => {
  const path = require('path');
  const qrPath = path.join(__dirname, '..', 'assets', 'QR.jpeg');

  res.sendFile(qrPath, (err) => {
    if (err) {
      console.error('QR code file error:', err);
      res.status(404).json({ error: 'QR code not found' });
    }
  });
};

// Manually verify QR payment (admin function)
exports.verifyQRPayment = (req, res) => {
  const { orderId } = req.body;
  const db = require('../config/database');

  // Start transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error('Transaction begin error:', err);
      return res.status(500).json({ error: 'Transaction failed' });
    }

    // Get order details
    const getOrderQuery = `
      SELECT o.*, oi.product_id, oi.quantity
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ?
    `;

    db.query(getOrderQuery, [orderId], (err, results) => {
      if (err) {
        return db.rollback(() => {
          console.error('Order fetch error:', err);
          res.status(500).json({ error: err.message });
        });
      }

      if (!results || results.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ error: 'Order not found' });
        });
      }

      const order = results[0];
      if (order.status !== 'pending_payment') {
        return db.rollback(() => {
          res.status(400).json({ error: 'Order is not pending QR payment verification' });
        });
      }

      // Group products
      const products = {};
      results.forEach(row => {
        if (!products[row.product_id]) {
          products[row.product_id] = row.quantity;
        }
      });

      // Check stock availability again
      const checkStockPromises = Object.entries(products).map(([productId, quantity]) => {
        return new Promise((resolve, reject) => {
          const query = 'SELECT stock FROM products WHERE id = ?';
          db.query(query, [productId], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error(`Product ${productId} not found`));
            const availableStock = results[0].stock;
            if (availableStock < quantity) {
              return reject(new Error(`Insufficient stock for product ${productId}. Available: ${availableStock}, Requested: ${quantity}`));
            }
            resolve();
          });
        });
      });

      Promise.all(checkStockPromises)
        .then(() => {
          // Decrement stock
          const updateStockPromises = Object.entries(products).map(([productId, quantity]) => {
            return new Promise((resolve, reject) => {
              const updateQuery = 'UPDATE products SET stock = stock - ? WHERE id = ?';
              db.query(updateQuery, [quantity, productId], (err, result) => {
                if (err) return reject(err);
                if (result.affectedRows === 0) return reject(new Error(`Failed to update stock for product ${productId}`));
                resolve();
              });
            });
          });

          Promise.all(updateStockPromises)
            .then(() => {
              // Update order status
              const updateOrderQuery = 'UPDATE orders SET status = ? WHERE id = ?';
              db.query(updateOrderQuery, ['paid', orderId], (err, result) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Order status update error:', err);
                    res.status(500).json({ error: err.message });
                  });
                }

                // Commit transaction
                db.commit((err) => {
                  if (err) {
                    return db.rollback(() => {
                      console.error('Transaction commit error:', err);
                      res.status(500).json({ error: 'Transaction commit failed' });
                    });
                  }

                  res.json({
                    success: true,
                    message: 'QR payment verified successfully. Order status updated and stock decremented.',
                    orderId
                  });
                });
              });
            })
            .catch((stockErr) => {
              db.rollback(() => {
                console.error('Stock update error:', stockErr);
                res.status(500).json({ error: stockErr.message });
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
  });
};
