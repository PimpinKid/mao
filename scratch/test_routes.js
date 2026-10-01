const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());

const db = new sqlite3.Database(':memory:');
const dbRun = (sql, params = []) => new Promise((resolve, reject) => db.run(sql, params, function(err) { if (err) reject(err); else resolve(this); }));
const dbGet = (sql, params = []) => new Promise((resolve, reject) => db.get(sql, params, (err, row) => { if (err) reject(err); else resolve(row); }));
const dbAll = (sql, params = []) => new Promise((resolve, reject) => db.all(sql, params, (err, rows) => { if (err) reject(err); else resolve(rows); }));

const authenticate = (req, res, next) => { req.user = { id: 1 }; next(); };
const adminAuth = (req, res, next) => { next(); };

(async () => {
    // Setup schema
    await dbRun(`CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT)`);
    await dbRun(`INSERT INTO settings (key, value) VALUES ('reserves', '{"USDT":1000}')`);
    await dbRun(`CREATE TABLE orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, from_currency TEXT, to_currency TEXT, amount_give REAL, amount_get REAL, user_wallet TEXT, status TEXT, from_network TEXT, to_network TEXT, deposit_address TEXT)`);
    await dbRun(`CREATE TABLE service_requisites (id INTEGER PRIMARY KEY AUTOINCREMENT, currency TEXT, bank_name TEXT, recipient_name TEXT, account_number TEXT, daily_limit REAL, is_active INTEGER)`);
    await dbRun(`INSERT INTO service_requisites (currency, bank_name, account_number, is_active) VALUES ('RUB', 'Sberbank', '1234', 1)`);
    
    // Include routes
    const fs = require('fs');
    const code = fs.readFileSync(__dirname + '/api_classic.js', 'utf8');
    eval(code);

    const request = require('supertest');
    
    console.log("Testing GET /api/reserves");
    let res = await request(app).get('/api/reserves');
    console.log(res.body);

    console.log("Testing POST /api/orders");
    res = await request(app).post('/api/orders').send({
        from_currency: 'RUB', to_currency: 'USDT', amount_give: 10000, amount_get: 100, user_wallet: '0x123'
    });
    console.log(res.body);

    console.log("Testing GET /api/user/orders");
    res = await request(app).get('/api/user/orders');
    console.log(res.body);
    
    console.log("Testing GET /api/admin/requisites");
    res = await request(app).get('/api/admin/requisites');
    console.log(res.body);
})();
