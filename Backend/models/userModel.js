const db = require("../config/database");

// 🔹 get all products
const getAllProducts = (callback) => {
  const query = "SELECT * FROM products ORDER BY createdAt DESC";

  db.execute(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

// 🔹 get user by email
const getUserByEmail = async (email) => {
  const [rows] = await db.promise().query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows;
};

// 🔹 get user address
const getUserAddress = async (userId) => {
  const [rows] = await db.promise().query(
    "SELECT * FROM user_addresses WHERE user_id = ?",
    [userId]
  );
  return rows;
};

// 🔹 save onboarding
const saveOnboarding = async (userId, address, city, pincode, mobile) => {
  await db.promise().query(
    `INSERT INTO user_addresses (user_id, address, city, pincode)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
     address=VALUES(address),
     city=VALUES(city),
     pincode=VALUES(pincode)`,
    [userId, address, city, pincode]
  );

  await db.promise().query(
    "UPDATE users SET mobile=?, onboardingStep=2 WHERE id=?",
    [mobile, userId]
  );
};

module.exports = {
  getAllProducts,
  getUserByEmail,
  getUserAddress,
  saveOnboarding
};