
require("dotenv").config();
const express = require("express");

const cors = require("cors");
const path = require("path");
const multer = require("multer");


const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const app = express();
const PORT =5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static folder for images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Static folder for assets (QR code, etc.)
app.use("/assets", express.static(path.join(__dirname, "assets")));


// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api", orderRoutes);
// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Product API is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});