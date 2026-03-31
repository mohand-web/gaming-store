const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) console.error('Database connection failed: ' + err.stack);
    else console.log('Connected to MySQL Database ✅');
});

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });


app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "customer")';


        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error("DB Error:", err);
                if (err.code === 'ER_DUP_ENTRY') {
                    if (err.sqlMessage.includes('username')) {
                        return res.status(409).json({ error: 'Username already taken!' });
                    } else if (err.sqlMessage.includes('email')) {
                        return res.status(409).json({ error: 'Email already registered!' });
                    }
                }
                return res.status(500).json({ error: 'Registration failed, please try again.' });
            }
            res.json({ message: 'User registered successfully!', id: result.insertId, role: 'customer' });
        });
    } catch (error) {
        console.error("Bcrypt Error:", error);
        res.status(500).json({ error: 'Error encrypting password' });
    }
});
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';

    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length > 0) {
            const user = results[0];
            let isMatch = false;

            try {
                isMatch = await bcrypt.compare(password, user.password);
            } catch (e) {
                isMatch = (password === user.password);
            }

            if (!isMatch) isMatch = (password === user.password); 

            if (isMatch) {
                const { password: _, ...userWithoutPassword } = user;
                res.json({ message: 'Login successful', user: userWithoutPassword });
            } else {
                res.status(401).json({ error: 'Invalid password' });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});


app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.get('/api/products/featured', (req, res) => {
    const sql = 'SELECT * FROM products ORDER BY RAND() LIMIT 4';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) res.json(results[0]);
        else res.status(404).json({ message: 'Product not found' });
    });
});

app.post('/api/products', upload.single('image'), (req, res) => {
    const { name, price, description, category, stock } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = 'INSERT INTO products (name, price, description, image_url, category, stock) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, price, description, imagePath, category, stock], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Product added!', id: result.insertId });
    });
});

app.put('/api/products/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, price, description, category, stock } = req.body;
    let sql = 'UPDATE products SET name=?, price=?, description=?, category=?, stock=?';
    let params = [name, price, description, category, stock];

    if (req.file) {
        sql += ', image_url=?';
        params.push(`/uploads/${req.file.filename}`);
    }
    sql += ' WHERE id=?';
    params.push(id);

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Product updated!' });
    });
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Product deleted!' });
    });
});

app.post('/api/cart', (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    const sql = `
        INSERT INTO cart (user_id, product_id, quantity) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE quantity = quantity + ?`;

    db.query(sql, [user_id, product_id, quantity, quantity], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Item added to cart successfully" });
    });
});

app.get('/api/cart/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT cart.id AS cart_id, cart.product_id AS id, cart.quantity, products.name, products.price, products.image_url 
        FROM cart 
        JOIN products ON cart.product_id = products.id 
        WHERE cart.user_id = ?`;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

app.delete('/api/cart/:cartItemId', (req, res) => {
    const { cartItemId } = req.params;
    const sql = "DELETE FROM cart WHERE id = ?";
    db.query(sql, [cartItemId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Item removed from cart" });
    });
});

app.delete('/api/cart/clear/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = 'DELETE FROM cart WHERE user_id = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error clearing cart:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Cart cleared successfully' });
    });
});

app.delete('/api/cart/remove-items', (req, res) => {
    const { userId, productIds } = req.body;

    if (!userId || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ error: 'Invalid userId or productIds' });
    }

    const sanitizedIds = productIds.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
    if (sanitizedIds.length === 0) {
        return res.status(400).json({ error: 'No valid productIds provided' });
    }

    const sql = 'DELETE FROM cart WHERE user_id = ? AND product_id IN (?)';
    db.query(sql, [userId, sanitizedIds], (err, result) => {
        if (err) {
            console.error('Error removing purchased cart items:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Purchased items removed from cart' });
    });
});

app.post('/api/wishlist', (req, res) => {
    const { user_id, product_id } = req.body;
    const sql = "INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)";
    db.query(sql, [user_id, product_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Added to wishlist" });
    });
});

app.get('/api/wishlist/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT products.id, products.name, products.price, products.image_url 
        FROM wishlist 
        JOIN products ON wishlist.product_id = products.id 
        WHERE wishlist.user_id = ?`;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});


app.put('/api/admin/update-role', (req, res) => {
    const { adminEmail, targetUserId, newRole } = req.body;

    if (!adminEmail || adminEmail.toLowerCase() !== 'mohand00055k@gmail.com') {
        return res.status(403).json({ message: "Access Denied: Only Mohand Can Change Roles!" });
    }

    const validRoles = ['admin', 'customer'];
    if (!validRoles.includes(newRole)) {
        return res.status(400).json({ message: "Invalid role type!" });
    }

    const sql = "UPDATE users SET role = ? WHERE id = ?";
    db.query(sql, [newRole, targetUserId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: `User promoted to ${newRole} successfully! 👑` });
    });
});
app.get('/api/users', (req, res) => {
    const sql = "SELECT id, username, email, role FROM users";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { adminEmail } = req.query;

    if (!adminEmail || adminEmail.toLowerCase() !== 'mohand00055k@gmail.com') {
        return res.status(403).json({ message: "Access Denied!" });
    }

    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "User deleted successfully! 🗑️" });
    });
});

app.get('/api/categories', (req, res) => {
    const sql = "SELECT * FROM categories";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

app.post('/api/categories', (req, res) => {
    const sql = "INSERT INTO categories (name) VALUES (?)";
    db.query(sql, [req.body.name], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Category added", id: result.insertId });
    });
});

app.put('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Category name is required' });
    }
    const sql = 'UPDATE categories SET name = ? WHERE id = ?';
    db.query(sql, [name.trim(), id], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Category name already exists' });
            }
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        return res.json({ message: 'Category updated successfully' });
    });
});

app.delete('/api/categories/:id', (req, res) => {
    const sql = "DELETE FROM categories WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Category deleted" });
    });
});

app.delete('/api/cart/clear/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = "DELETE FROM cart WHERE user_id = ?";

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error("Error clearing cart:", err);
            return res.status(500).json({ message: "Failed to clear cart database" });
        }
        res.status(200).json({ message: "Cart cleared successfully" });
    });
});

app.post('/api/order/confirm', async (req, res) => {
  const { userId, cartItems } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const updateStockQueries = cartItems.map(item => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE products SET stock = stock - ? WHERE id = ?";
      db.query(sql, [item.quantity, item.id], (err, result) => {
        if (err) {
          console.error(`Error updating stock for product ${item.id}:`, err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  try {
    await Promise.all(updateStockQueries);

    const deleteCartSql = userId ? "DELETE FROM cart WHERE user_id = ?" : "SELECT 1";
    db.query(deleteCartSql, [userId], (err, result) => {
      if (err) return res.status(500).json({ message: "Stock updated but failed to clear cart" });
      res.status(200).json({ message: "Order processed: Stock updated and cart cleared" });
    });
  } catch (err) {
    res.status(500).json({ message: "Critical error updating inventory" });
  }
});

app.delete('/api/wishlist/:userId/:productId', (req, res) => {
    const { userId, productId } = req.params;
    const sql = "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?";
    db.query(sql, [userId, productId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Item not found" });
        res.json({ message: "Removed from wishlist" });
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});