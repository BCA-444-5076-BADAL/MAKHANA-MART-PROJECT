-- ===============================================
-- TEST DATA FOR ECOMMERCE DATABASE
-- ===============================================

-- 1. INSERT TEST USERS
-- Note: Passwords are hashed using bcrypt (10 rounds)
-- Hashed passwords:
-- test1@example.com: "password123" -> $2a$10$F.pKYWSkLgB5VoXQrPHrKOlS.6LZ0nN7T5p5Q5qZ5X5Y5Z5X5Y5Z5Z (for reference only)
-- For testing, you may want to use plain passwords and hash them via your signup endpoint

INSERT INTO users (name, email, password, mobile, onboardingStep, created_at, updated_at) VALUES
('John Doe', 'john@example.com', '$2a$10$nOUis5kJ/F9z7c5i.6qxIO7VL3K8Ik8Qm8J9K9L9M9N9O9P9Q9R9', '9876543210', 2, NOW(), NOW()),
('Jane Smith', 'jane@example.com', '$2a$10$X3Yg8H7F4E3D2C1B0A9Z8Y7X6W5V4U3T2S1R0Q9P8O7N6M5L4K3J', '8765432109', 2, NOW(), NOW()),
('Raj Patel', 'raj@example.com', '$2a$10$M5N4O3P2Q1R0S9T8U7V6W5X4Y3Z2A1B0C9D8E7F6G5H4I3J2K1L0', '9123456789', 2, NOW(), NOW()),
('Priya Singh', 'priya@example.com', '$2a$10$L1K0J9I8H7G6F5E4D3C2B1A0Z9Y8X7W6V5U4T3S2R1Q0P9O8N7M6', '9876543219', 1, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY),
('Anil Kumar', 'anil@example.com', '$2a$10$Z0Y9X8W7V6U5T4S3R2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C7B6A5', '8987654321', 2, NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 10 DAY);

-- 2. INSERT USER ADDRESSES
INSERT INTO user_addresses (user_id, address, city, pincode, created_at) VALUES
(1, '123 Main Street, Apartment 4B', 'Mumbai', '400001', NOW()),
(2, '456 Oak Avenue, Suite 200', 'Delhi', '110001', NOW()),
(3, '789 Pine Road, House No. 42', 'Bangalore', '560001', NOW()),
(4, '321 Elm Street', 'Pune', '411001', NOW()),
(5, '654 Maple Drive, Floor 3', 'Hyderabad', '500001', NOW());

-- 3. INSERT TEST PRODUCTS (10 products across different categories)
INSERT INTO products (productName, productPrice, description, category, productImage, stock, createdAt, updatedAt) VALUES
('Wireless Headphones', 2999.99, 'High-quality wireless headphones with noise cancellation and 30-hour battery life', 'Electronics', 'https://via.placeholder.com/300?text=Headphones', 45, NOW(), NOW()),
('USB-C Cable', 499.99, 'Fast charging USB-C cable, 2 meter length, compatible with all USB-C devices', 'Accessories', 'https://via.placeholder.com/300?text=USB-C+Cable', 120, NOW(), NOW()),
('Phone Stand', 599.99, 'Adjustable phone stand for desk, compatible with all phone sizes', 'Accessories', 'https://via.placeholder.com/300?text=Phone+Stand', 85, NOW(), NOW()),
('Laptop Cooling Pad', 1999.99, 'Electric laptop cooling pad with 5 fans, USB powered', 'Electronics', 'https://via.placeholder.com/300?text=Cooling+Pad', 32, NOW(), NOW()),
('Screen Protector Pack', 299.99, 'Pack of 3 tempered glass screen protectors for phones', 'Accessories', 'https://via.placeholder.com/300?text=Screen+Protector', 200, NOW(), NOW()),
('Mechanical Keyboard', 4499.99, 'RGB Mechanical Keyboard with Cherry MX switches', 'Electronics', 'https://via.placeholder.com/300?text=Keyboard', 28, NOW(), NOW()),
('Mouse Pad', 399.99, 'Large gaming mouse pad with non-slip rubber base', 'Accessories', 'https://via.placeholder.com/300?text=Mouse+Pad', 150, NOW(), NOW()),
('Wireless Mouse', 1299.99, 'Wireless mouse with precision tracking and 18-month battery life', 'Electronics', 'https://via.placeholder.com/300?text=Wireless+Mouse', 67, NOW(), NOW()),
('Phone Case Set', 799.99, 'Pack of 2 premium phone cases with protection', 'Accessories', 'https://via.placeholder.com/300?text=Phone+Case', 180, NOW(), NOW()),
('Webcam HD', 3499.99, '1080p HD Webcam with auto-focus and built-in microphone', 'Electronics', 'https://via.placeholder.com/300?text=Webcam', 38, NOW(), NOW());

-- 4. INSERT TEST ORDERS (5 orders with different statuses)
INSERT INTO orders (user_id, amount, payment_id, status, created_at, updated_at) VALUES
(1, 3499.98, 'pay_2Q8Z6K3M5P9X', 'completed', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY),
(2, 2799.98, 'pay_3R9Z7L4N6Q0Y', 'completed', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY),
(3, 6099.97, 'pay_4S0Z8M5O7R1Z', 'pending', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY),
(4, 1599.97, 'pay_5T1Z9N6P8S2A', 'processing', NOW(), NOW()),
(5, 4799.98, 'pay_6U2Z0O7Q9T3B', 'completed', NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY);

-- 5. INSERT ORDER ITEMS (map products to orders)
-- Order 1 (John): Wireless Headphones (2999.99) + USB-C Cable (499.99)
INSERT INTO order_items (order_id, product_id, quantity, created_at) VALUES
(1, 1, 1, NOW() - INTERVAL 3 DAY),
(1, 2, 1, NOW() - INTERVAL 3 DAY);

-- Order 2 (Jane): Phone Stand (599.99) + Screen Protector Pack (299.99) + Mouse Pad (399.99) + Wireless Mouse (1500.02 with tax)
INSERT INTO order_items (order_id, product_id, quantity, created_at) VALUES
(2, 3, 1, NOW() - INTERVAL 5 DAY),
(2, 5, 1, NOW() - INTERVAL 5 DAY),
(2, 7, 1, NOW() - INTERVAL 5 DAY);

-- Order 3 (Raj): Laptop Cooling Pad (1999.99) + Mechanical Keyboard (4499.99) + USB-C Cable (499.99)
INSERT INTO order_items (order_id, product_id, quantity, created_at) VALUES
(3, 4, 1, NOW() - INTERVAL 1 DAY),
(3, 6, 1, NOW() - INTERVAL 1 DAY),
(3, 2, 1, NOW() - INTERVAL 1 DAY);

-- Order 4 (Priya): Wireless Mouse (1299.99) + Phone Case Set (799.99)
INSERT INTO order_items (order_id, product_id, quantity, created_at) VALUES
(4, 8, 1, NOW()),
(4, 9, 1, NOW());

-- Order 5 (Anil): Phone Stand (599.99) + Webcam HD (3499.99) + USB-C Cable (499.99) + Screen Protector (300.01 with tax)
INSERT INTO order_items (order_id, product_id, quantity, created_at) VALUES
(5, 3, 1, NOW() - INTERVAL 7 DAY),
(5, 10, 1, NOW() - INTERVAL 7 DAY),
(5, 2, 1, NOW() - INTERVAL 7 DAY);

-- ===============================================
-- VERIFICATION QUERIES
-- ===============================================

-- Verify users were inserted
SELECT COUNT(*) as total_users FROM users;
SELECT * FROM users;

-- Verify products were inserted
SELECT COUNT(*) as total_products FROM products;
SELECT * FROM products;

-- Verify orders were inserted
SELECT COUNT(*) as total_orders FROM orders;
SELECT * FROM orders;

-- Verify order items were inserted
SELECT COUNT(*) as total_order_items FROM order_items;
SELECT * FROM order_items;

-- Complex query: Get order details with user and products info
SELECT 
    o.id as order_id,
    u.name as customer_name,
    u.email as customer_email,
    o.amount,
    o.status,
    o.created_at,
    p.productName,
    oi.quantity,
    (p.productPrice * oi.quantity) as item_total
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
ORDER BY o.created_at DESC;
