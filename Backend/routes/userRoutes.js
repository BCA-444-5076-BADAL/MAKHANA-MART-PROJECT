const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const db = require("../config/database");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
// Get all products
router.get("/products", userController.getAllProducts);


// Login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // address check
    const [address] = await db.promise().query(
      "SELECT * FROM user_addresses WHERE user_id = ?",
      [user.id]
    );

    let nextScreen = "home";

    if (address.length === 0 || !user.mobile) {
      nextScreen = "onboarding";
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
      nextScreen
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/save-onboarding", async (req, res) => {
  const { userId, address, city, pincode, mobile } = req.body;

  try {
    if (!mobile || mobile.length !== 10) {
      return res.status(400).json({ error: "Invalid mobile number" });
    }

    await db.promise().query(
      "INSERT INTO user_addresses (user_id, address, city, pincode) VALUES (?, ?, ?, ?)",
      [userId, address, city, pincode]
    );

    await db.promise().query(
      "UPDATE users SET mobile=?, onboardingStep=2 WHERE id=?",
      [mobile, userId]
    );

    res.json({
      message: "Onboarding completed",
      nextScreen: "home"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    // Check if user exists
    const [user] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length) return res.status(400).json({ error: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.promise().query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      username,
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;