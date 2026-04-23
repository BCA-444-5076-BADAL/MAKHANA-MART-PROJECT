
require("dotenv").config();
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController');
const multer = require("multer");

const paymentController = require('../controllers/paymentController');

// Multer configuration for upload folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // uploads folder backend me create karo
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
// Create a new product
router.post('/products',  upload.single("productImage"),productController.createProduct);
router.get("/test",(req,res)=>{
    console.log("Data ");
    
    res.send("Successfully")
});
// Get all products
router.get('/products', productController.getAllProducts);

// Get product by ID
router.get('/products/:id', productController.getProductById);

// Update a product
router.put('/products/:id', upload.single("productImage"), productController.updateProduct);

// Delete a product
router.delete('/products/:id', productController.deleteProduct);

// Get products by category
router.get('/products/category/:category', productController.getProductsByCategory);

// Admin order management
router.get('/orders', orderController.adminGetAllOrders);
router.get('/orders/:orderId', orderController.adminGetOrderById);
router.put('/orders/:orderId', orderController.adminUpdateOrder);
router.delete('/orders/:orderId', orderController.adminDeleteOrder);

// Admin user management
router.get('/users', userController.adminGetAllUsers);
router.put('/users/:userId', userController.adminUpdateUser);
router.delete('/users/:userId', userController.adminDeleteUser);

// Razorpay payment order creation
router.post('/create-razorpay-order', paymentController.createOrder);

// Razorpay payment verification
router.post('/verify-payment', paymentController.verifyPayment);

// Get QR code for payment
router.get('/qr-code', paymentController.getQRCode);

// Manually verify QR payment (admin only)
router.post('/verify-qr-payment', paymentController.verifyQRPayment);

module.exports = router;