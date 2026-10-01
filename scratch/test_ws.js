const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        telegram_id TEXT,
        email TEXT,
        display_name TEXT,
        wallet_address TEXT,
        balance_rub REAL,
        usdt_balance REAL,
        is_banned INTEGER,
        role TEXT,
        is_verified_trader INTEGER,
        created_at DATETIME
    )`);
    db.run(`INSERT INTO users (id, balance_rub) VALUES (1, 100)`);
    db.run(`CREATE TABLE p2p_deals (id INTEGER PRIMARY KEY)`);
});

const server = http.createServer(app);
const io = new Server(server);

// Apply module
const apiAdminWs = require('./api_admin_ws');
apiAdminWs(app, io, db);

// Test routes
(async () => {
    server.listen(0, async () => {
        const port = server.address().port;
        const fetch = (await import('node-fetch')).default;
        
        // 1. Login
        let res = await fetch(`http://localhost:${port}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'admin123' })
        });
        console.log('Login:', await res.json());
        const cookie = res.headers.get('set-cookie');
        
        // 2. Get Users
        res = await fetch(`http://localhost:${port}/api/admin/users`, {
            headers: { 'Cookie': cookie }
        });
        console.log('Users:', await res.json());

        // 3. Update Balance
        res = await fetch(`http://localhost:${port}/api/admin/users/1/balance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
            body: JSON.stringify({ rub_balance: 500 })
        });
        console.log('Update balance:', await res.json());

        // 4. Check Deals
        res = await fetch(`http://localhost:${port}/api/admin/deals`, {
            headers: { 'Cookie': cookie }
        });
        console.log('Deals:', await res.json());

        server.close();
        db.close();
    });
})();
