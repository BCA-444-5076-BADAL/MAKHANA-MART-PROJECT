const userModel = require("../models/userModel");
const db = require("../config/database");

// Get all products
exports.getAllProducts = (req, res) => {
  userModel.getAllProducts((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ products: results });
  });
};

// Admin: get all users with address
exports.adminGetAllUsers = async (req, res) => {
  try {
    const query = `
      SELECT u.id AS userId,
             u.name,
             u.email,
             u.mobile,
             u.created_at AS createdAt,
             ua.address,
             ua.city,
             ua.pincode
      FROM users u
      LEFT JOIN user_addresses ua ON ua.user_id = u.id
      ORDER BY u.created_at DESC
    `;
    const [rows] = await db.promise().query(query);
    res.json(rows);
  } catch (err) {
    console.error('Admin get users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Admin: update user profile and address
exports.adminUpdateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, mobile, address, city, pincode } = req.body;

  try {
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (mobile !== undefined) {
      updates.push('mobile = ?');
      values.push(mobile);
    }

    if (updates.length > 0) {
      const [result] = await db.promise().query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, [...values, userId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    if (address !== undefined || city !== undefined || pincode !== undefined) {
      await db.promise().query(
        `INSERT INTO user_addresses (user_id, address, city, pincode)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           address = VALUES(address),
           city = VALUES(city),
           pincode = VALUES(pincode)`,
        [userId, address || '', city || '', pincode || '']
      );
    }

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Admin update user error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Admin: delete a user
exports.adminDeleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const [result] = await db.promise().query('DELETE FROM users WHERE id = ?', [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};