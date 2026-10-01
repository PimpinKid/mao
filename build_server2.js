const fs = require('fs');

const authCode = fs.readFileSync('scratch/api_auth.js', 'utf8')
    .replace(/const express = require\('express'\);/g, '')
    .replace(/const bcrypt = require\('bcrypt'\);/g, '')
    .replace(/const jwt = require\('jsonwebtoken'\);/g, '')
    .replace(/const ethers = require\('ethers'\);/g, '')
    .replace(/module\.exports\s*=\s*/, '');

const p2pCode = fs.readFileSync('scratch/api_p2p.js', 'utf8').replace(/module\.exports\s*=\s*/, '');
const adminCode = fs.readFileSync('scratch/api_admin_ws.js', 'utf8').replace(/module\.exports\s*=\s*/, '');

const finalServer = `
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ethers = require('ethers');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname))); // serve html

const JWT_SECRET = process.env.JWT_SECRET || 'mao_exchange_super_secret_jwt_key_2025';

// Database Setup
const db = new sqlite3.Database('crypto.db');
const dbRun = (sql, params = []) => new Promise((resolve, reject) => db.run(sql, params, function(err) { if (err) reject(err); else resolve(this); }));
const dbGet = (sql, params = []) => new Promise((resolve, reject) => db.get(sql, params, (err, row) => { if (err) reject(err); else resolve(row); }));
const dbAll = (sql, params = []) => new Promise((resolve, reject) => db.all(sql, params, (err, rows) => { if (err) reject(err); else resolve(rows); }));

// Attach IO to req
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Helper auth middleware for routes that need req.user globally
const globalAuthenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (!err) req.user = user;
            next();
        });
    } else {
        next();
    }
};
app.use('/api/p2p', globalAuthenticate);
app.use('/api/user', globalAuthenticate);

// ==== MODULES ====
const authRouter = (${authCode})(db, JWT_SECRET);
app.use('/api', authRouter);

(${p2pCode})(app, dbRun, dbGet, dbAll);

(${adminCode})(app, io, db);
// ==== END MODULES ====

// HTML Fallbacks
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
    console.log('🚀 Сервер MAO Exchange запущен на порту ' + PORT);
});
`;

fs.writeFileSync('server.js', finalServer);
console.log("Built server.js");
