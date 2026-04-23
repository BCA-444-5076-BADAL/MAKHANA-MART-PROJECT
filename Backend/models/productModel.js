const db = require("../config/database");

// Create a new product
const createProduct = (productData, callback) => {
  const { productName, productPrice, description, category , productImage, stock} = productData;


  const query =
    "INSERT INTO products (productName, productPrice, description, category , productImage, stock  ) VALUES (?, ?, ?, ?,?, ?)";

  db.execute(
    query,
    [productName, productPrice, description, category,productImage, stock],
    (err, results) => {
      if (err) return callback(err, null);
      callback(null, { id: results.insertId, ...productData });
    }
  );
};

// Get all products
const getAllProducts = (callback) => {
  const query = "SELECT * FROM products ORDER BY createdAt DESC";

  db.execute(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

// Get product by ID
const getProductById = (id, callback) => {
  const query = "SELECT * FROM products WHERE id = ?";

  db.execute(query, [id], (err, results) => {
    if (err) return callback(err, null);
    if (results.length === 0)
      return callback({ message: "Product not found" }, null);
    callback(null, results[0]);
  });
};

// Update a product
const updateProduct = (id, productData, callback) => {
  const { productName, productPrice, description, category, stock } = productData;
  const query =
    "UPDATE products SET productName = ?, productPrice = ?, description = ?, category = ?, stock = ? WHERE id = ?";

  db.execute(
    query,
    [productName, productPrice, description, category, stock, id],
    (err, results) => {
      if (err) return callback(err, null);
      if (results.affectedRows === 0)
        return callback({ message: "Product not found" }, null);
      callback(null, { id: parseInt(id), ...productData });
    }
  );
};

// Delete a product
const deleteProduct = (id, callback) => {
  const query = "DELETE FROM products WHERE id = ?";

  db.execute(query, [id], (err, results) => {
    if (err) return callback(err, null);
    if (results.affectedRows === 0)
      return callback({ message: "Product not found" }, null);
    callback(null, { message: "Product deleted successfully" });
  });
};

// Get products by category
const getProductsByCategory = (category, callback) => {
  const query =
    "SELECT * FROM products WHERE category = ? ORDER BY createdAt DESC";

  db.execute(query, [category], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};