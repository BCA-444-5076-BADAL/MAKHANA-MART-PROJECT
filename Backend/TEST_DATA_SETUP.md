# Database Test Data Setup Guide

## Overview
This guide explains how to populate your `ecommerce_db` database with test data for development and testing.

## Database Details
- **Database Type**: MySQL
- **Connection**: localhost (root user)
- **Database**: ecommerce_db
- **Test Data File**: `seed_test_data.sql`

## How to Run the Test Data Script

### Option 1: Using MySQL Command Line (Recommended)

1. **Open Command Prompt or PowerShell**

2. **Navigate to your Backend directory** (or anywhere that has the SQL file):
   ```bash
   cd c:\Users\DELL\Desktop\Badal_project\Backend
   ```

3. **Run the SQL script**:
   ```bash
   mysql -u root -p ecommerce_db < seed_test_data.sql
   ```
   When prompted, enter the password: `badal`

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local MySQL server (localhost, root user)
3. Open the database `ecommerce_db`
4. Go to **File → Open SQL Script** (or Ctrl+O)
5. Select `seed_test_data.sql`
6. Click the **Execute** button (or press Ctrl+Shift+Enter)

### Option 3: Using Node.js (Via your backend)

1. Create a new file `run_seed.js` in your Backend directory:
   ```javascript
   const db = require('./config/database');
   const fs = require('fs');
   
   const sql = fs.readFileSync('./seed_test_data.sql', 'utf8');
   
   db.query(sql, (err, results) => {
     if (err) {
       console.error('Error running seed script:', err);
       process.exit(1);
     }
     console.log('✓ Test data inserted successfully!');
     console.log('Results:', results);
     db.end();
   });
   ```

2. Run the script:
   ```bash
   node run_seed.js
   ```

---

## Test Data Summary

### Users (5 test users)
| Email | Name | Password | Onboarding | Phone |
|-------|------|----------|-----------|-------|
| john@example.com | John Doe | Hashed | Complete | 9876543210 |
| jane@example.com | Jane Smith | Hashed | Complete | 8765432109 |
| raj@example.com | Raj Patel | Hashed | Complete | 9123456789 |
| priya@example.com | Priya Singh | Hashed | Incomplete | 9876543219 |
| anil@example.com | Anil Kumar | Hashed | Complete | 8987654321 |

**Note**: Passwords are stored as bcrypt hashes. For testing login, you may need to update them with actual hashed versions or test directly with the hashed values in the database.

### Products (10 test products)
Categories: **Electronics** and **Accessories**
- Wireless Headphones, USB-C Cable, Phone Stand, Laptop Cooling Pad
- Screen Protector Pack, Mechanical Keyboard, Mouse Pad, Wireless Mouse
- Phone Case Set, Webcam HD

### Orders (5 test orders)
- **Status Distribution**: 3 completed, 1 processing, 1 pending
- **Date Range**: Orders span from 10 days ago to today
- **Price Range**: ₹1,599.97 to ₹6,099.97

### Order Items (13 total)
- Each order has 2-3 items linked to products
- Realistic quantities and pricing

---

## Verification Queries

After running the script, you can verify the data with these queries:

```sql
-- Check total users
SELECT COUNT(*) as total_users FROM users;

-- Check total products
SELECT COUNT(*) as total_products FROM products;

-- Check all orders with customer details
SELECT o.id, u.name, u.email, o.amount, o.status, o.created_at 
FROM orders o 
JOIN users u ON o.user_id = u.id 
ORDER BY o.created_at DESC;

-- Check order items for a specific order
SELECT o.id as order_id, u.name, p.productName, oi.quantity, 
       (p.productPrice * oi.quantity) as item_total
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
ORDER BY o.created_at DESC;

-- Check products by category
SELECT category, COUNT(*) as count, AVG(productPrice) as avg_price 
FROM products 
GROUP BY category;
```

---

## Resetting the Database

If you need to clear all data and start fresh:

```sql
-- Delete all data (keeping tables intact)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM user_addresses;
DELETE FROM users;
DELETE FROM products;

-- Reset auto-increment counters
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE orders AUTO_INCREMENT = 1;
ALTER TABLE order_items AUTO_INCREMENT = 1;
ALTER TABLE user_addresses AUTO_INCREMENT = 1;
```

Then run `seed_test_data.sql` again.

---

## Important Notes

1. **Passwords**: The test users have bcrypt-hashed passwords. For testing login, you may want to:
   - Use the hashed values stored in the database
   - Or create users through your signup endpoint with plain passwords

2. **Foreign Keys**: All foreign key relationships are properly maintained. Users are linked to addresses, and orders are linked to users and products.

3. **Timestamps**: Test data includes realistic timestamps (from the past few days to today) to simulate real usage patterns.

4. **Stock Levels**: Products have varying stock levels to test inventory management.

5. **Admin Panel**: With this data, your admin panel should show:
   - Multiple users with complete profiles
   - Multiple orders with different statuses
   - Product listings with images and pricing
   - Order history with order items

---

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Verify password is `badal`
- Check MySQL is running: `mysql -u root -p -e "SELECT 1;"`

### "Unknown database 'ecommerce_db'"
- First, create the tables: `mysql -u root -p < create_tables.sql`
- Then run the seed script

### "Duplicate entry for key 'email'"
- Delete existing users: `DELETE FROM users;`
- Or run the reset script above

### Foreign key constraint errors
- Run `create_tables.sql` first to ensure all tables exist
- Check that `create_tables.sql` is executed before `seed_test_data.sql`

---

## Next Steps

1. ✓ Run the seed script using one of the options above
2. ✓ Verify data with the verification queries
3. ✓ Test your admin panel to see users and orders
4. ✓ Test your authentication with test user emails
5. ✓ Create checkout/order functionality tests

Your database is now ready for development and testing!
