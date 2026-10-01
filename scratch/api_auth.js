const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ethers = require('ethers');

module.exports = function (db, JWT_SECRET = 'your-secret-key') {
    const router = express.Router();

    const authenticate = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ error: 'Forbidden' });
            req.user = user;
            next();
        });
    };

    router.post('/auth/email/register-init', async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

            const userExists = await new Promise((resolve, reject) => {
                db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (userExists) return res.status(400).json({ error: 'User already exists' });

            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const passwordHash = await bcrypt.hash(password, 10);
            const expiresAt = Date.now() + 15 * 60 * 1000;

            await new Promise((resolve, reject) => {
                db.run(
                    'INSERT OR REPLACE INTO email_codes (email, code, password_hash, expires_at) VALUES (?, ?, ?, ?)',
                    [email, code, passwordHash, expiresAt],
                    function(err) {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });

            console.log(`[STUB EMAIL] To: ${email} | Code: ${code}`);
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/auth/email/register-confirm', async (req, res) => {
        try {
            const { email, code } = req.body;
            if (!email || !code) return res.status(400).json({ error: 'Missing fields' });

            const row = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM email_codes WHERE email = ?', [email], (err, r) => {
                    if (err) reject(err);
                    else resolve(r);
                });
            });

            if (!row || row.code !== code || row.expires_at < Date.now()) {
                return res.status(400).json({ error: 'Invalid or expired code' });
            }

            const userId = await new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)',
                    [email, row.password_hash, email.split('@')[0]],
                    function (err) {
                        if (err) reject(err);
                        else resolve(this.lastID);
                    }
                );
            });

            db.run('DELETE FROM email_codes WHERE email = ?', [email]);

            const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
            
            const user = await new Promise((resolve, reject) => {
                db.get('SELECT id, email, display_name, wallet_address, usdt_balance, role, balance_rub FROM users WHERE id = ?', [userId], (err, r) => {
                    if (err) reject(err);
                    else resolve(r);
                });
            });

            res.json({ success: true, token, user });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/auth/email/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

            const user = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (!user) return res.status(401).json({ error: 'Invalid credentials' });

            const valid = await bcrypt.compare(password, user.password_hash);
            if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
            
            const returnUser = await new Promise((resolve, reject) => {
                db.get('SELECT id, email, display_name, wallet_address, usdt_balance, role, balance_rub FROM users WHERE id = ?', [user.id], (err, r) => {
                    if (err) reject(err);
                    else resolve(r);
                });
            });
            res.json({ success: true, token, user: returnUser });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    
    router.post('/auth/email/forgot-init', async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ error: 'Missing fields' });
            const user = await new Promise((resolve, reject) => {
                db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            if (user) {
                const code = Math.floor(100000 + Math.random() * 900000).toString();
                const expiresAt = Date.now() + 15 * 60 * 1000;
                await new Promise((resolve, reject) => {
                    db.run(
                        'INSERT OR REPLACE INTO email_codes (email, code, expires_at) VALUES (?, ?, ?)',
                        [email, code, expiresAt],
                        function(err) {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
                console.log(`[STUB EMAIL] To: ${email} | Password Reset Code: ${code}`);
            }
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    
    router.post('/auth/email/forgot-confirm', async (req, res) => {
        try {
            const { email, code, newPassword } = req.body;
            if (!email || !code || !newPassword) return res.status(400).json({ error: 'Missing fields' });
            const row = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM email_codes WHERE email = ?', [email], (err, r) => {
                    if (err) reject(err);
                    else resolve(r);
                });
            });
            if (!row || row.code !== code || row.expires_at < Date.now()) {
                return res.status(400).json({ error: 'Invalid or expired code' });
            }
            const passwordHash = await bcrypt.hash(newPassword, 10);
            await new Promise((resolve, reject) => {
                db.run('UPDATE users SET password_hash = ? WHERE email = ?', [passwordHash, email], function (err) {
                    if (err) reject(err);
                    else resolve();
                });
            });
            db.run('DELETE FROM email_codes WHERE email = ?', [email]);
            const user = await new Promise((resolve, reject) => {
                db.get('SELECT id, email, display_name, wallet_address, usdt_balance, role, balance_rub FROM users WHERE email = ?', [email], (err, r) => {
                    if (err) reject(err);
                    else resolve(r);
                });
            });
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
            res.json({ success: true, token, user });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/auth/register', async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
            const passwordHash = await bcrypt.hash(password, 10);
            const userId = await new Promise((resolve, reject) => {
                db.run('INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)',
                    [email, passwordHash, email.split('@')[0]], function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                });
            });
            const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
            const user = await new Promise((resolve, reject) => {
                db.get('SELECT id, email, display_name, wallet_address, usdt_balance, role, balance_rub FROM users WHERE id = ?', [userId], (err, r) => {
                    if (err) reject(err);
                    else resolve(r);
                });
            });
            res.json({ success: true, token, user });
        } catch (err) {
            if (err.message && err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'User already exists' });
            }
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/auth/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
            const user = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            if (!user) return res.status(401).json({ error: 'Invalid credentials' });
            const valid = await bcrypt.compare(password, user.password_hash);
            if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
            const returnUser = await new Promise((resolve, reject) => {
                db.get('SELECT id, email, display_name, wallet_address, usdt_balance, role, balance_rub FROM users WHERE id = ?', [user.id], (err, r) => {
                    if (err) reject(err);
                    else resolve(r);
                });
            });
            res.json({ success: true, token, user: returnUser });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/auth/logout', (req, res) => res.json({ success: true }));

    router.get('/auth/me', authenticate, async (req, res) => {
        try {
            const user = await new Promise((resolve, reject) => {
                db.get('SELECT id, email, display_name, wallet_address, usdt_balance, role, balance_rub FROM users WHERE id = ?', [req.user.id], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/user/wallet', authenticate, async (req, res) => {
        try {
            const { wallet_address, usdt_balance, signature, message } = req.body;
            if (!wallet_address || !signature || !message) {
                return res.status(400).json({ error: 'Missing fields' });
            }

            const recoveredAddress = ethers.utils.verifyMessage(message, signature);
            if (recoveredAddress.toLowerCase() !== wallet_address.toLowerCase()) {
                return res.status(403).json({ error: 'Invalid signature' });
            }

            await new Promise((resolve, reject) => {
                db.run(
                    'UPDATE users SET wallet_address = ?, usdt_balance = ? WHERE id = ?',
                    [wallet_address, parseFloat(usdt_balance) || 0, req.user.id],
                    function (err) {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });

            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/user/wallet/disconnect', authenticate, async (req, res) => {
        try {
            await new Promise((resolve, reject) => {
                db.run(
                    'UPDATE users SET wallet_address = NULL, usdt_balance = 0 WHERE id = ?',
                    [req.user.id],
                    function (err) {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });

            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return { router, authenticate };
};
