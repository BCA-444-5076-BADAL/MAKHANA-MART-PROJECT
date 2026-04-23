const productModel = require("../models/productModel");
const fs = require("fs");
const path = require("path");

/* ===========================
   🔥 COMMON VALIDATION FUNCTION
=========================== */
const validateProduct = (productName, productPrice, category) => {
  if (!productName || !productPrice || !category) {
    return "Product name, price, and category are required";
  }

  // Name should not be only numbers
  if (/^\d+$/.test(productName.trim())) {
    return "Product name cannot be only numbers";
  }

  // Name length
  if (productName.trim().length < 3) {
    return "Product name must be at least 3 characters";
  }

  // Price validation
  const price = parseFloat(productPrice);
  if (isNaN(price) || price <= 0) {
    return "Product price must be a positive number";
  }

  return null;
};

/* ===========================
   ➕ CREATE PRODUCT
=========================== */
exports.createProduct = (req, res) => {
  const { productName, productPrice, description, category, stock } = req.body;
  const productImage = req.file ? req.file.filename : null;

  // Validate
  const error = validateProduct(productName, productPrice, category);
  if (error) {
    return res.status(400).json({ error });
  }

  // Validate stock
  const stockValue = parseInt(stock);
  if (isNaN(stockValue) || stockValue < 0) {
    return res.status(400).json({ error: "Stock must be a non-negative integer" });
  }

  const price = parseFloat(productPrice);

  productModel.createProduct(
    { productName, productPrice: price, description, category, productImage, stock: stockValue },
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "✅ Product created successfully",
        product: result,
      });
    }
  );
};

/* ===========================
   📦 GET ALL PRODUCTS
=========================== */
exports.getAllProducts = (req, res) => {
  productModel.getAllProducts((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({ products: results });
  });
};

/* ===========================
   🔍 GET PRODUCT BY ID
=========================== */
exports.getProductById = (req, res) => {
  const productId = req.params.id;

  productModel.getProductById(productId, (err, result) => {
    if (err) {
      if (err.message === "Product not found") {
        return res.status(404).json({ error: err.message });
      }
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({ product: result });
  });
};

/* ===========================
   ✏️ UPDATE PRODUCT
=========================== */
exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  const { productName, productPrice, description, category, stock } = req.body;
  const newImage = req.file ? req.file.filename : null;

  // Validate
  const error = validateProduct(productName, productPrice, category);
  if (error) {
    return res.status(400).json({ error });
  }

  // Validate stock
  const stockValue = parseInt(stock);
  if (isNaN(stockValue) || stockValue < 0) {
    return res.status(400).json({ error: "Stock must be a non-negative integer" });
  }

  const price = parseFloat(productPrice);

  productModel.getProductById(productId, (err, existingProduct) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!existingProduct)
      return res.status(404).json({ error: "Product not found" });

    const updatedData = {
      productName,
      productPrice: price,
      description,
      category,
      stock: stockValue,
    };

    // Handle image update
    if (newImage) {
      if (existingProduct.productImage) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          existingProduct.productImage
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updatedData.productImage = newImage;
    }

    productModel.updateProduct(productId, updatedData, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(200).json({
        message: "✅ Product updated successfully",
        product: result,
      });
    });
  });
};

/* ===========================
   ❌ DELETE PRODUCT
=========================== */
exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  productModel.getProductById(productId, (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product)
      return res.status(404).json({ error: "Product not found" });

    // Delete image
    if (product.productImage) {
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        product.productImage
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    productModel.deleteProduct(productId, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(200).json({
        message: "🗑️ Product deleted successfully",
        result,
      });
    });
  });
};

/* ===========================
   📂 GET BY CATEGORY
=========================== */
exports.getProductsByCategory = (req, res) => {
  const category = req.params.category;

  productModel.getProductsByCategory(category, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({ products: results });
  });
};