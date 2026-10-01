const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const http = require('http');

const app = express();
app.use(express.json());

const db = new sqlite3.Database('crypto.db');

const dbRun = (query, params = []) => new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({lastID: this.lastID, changes: this.changes});
    });
});
const dbGet = (query, params = []) => new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
    });
});
const dbAll = (query, params = []) => new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
    });
});

const authenticate = (req, res, next) => {
    req.user = { id: 1 };
    next();
};

const adminAuth = (req, res, next) => {
    next();
};

const apiCode = fs.readFileSync('scratch/api_classic.js', 'utf8');
eval(apiCode);

const server = app.listen(3002, async () => {
    try {
        let res = await fetch('http://localhost:3002/api/orders', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                from_currency: "RUB", to_currency: "BTC", amount_give: "abc", amount_get: "def"
            })
        });
        console.log("Invalid amount:", await res.json());

        res = await fetch('http://localhost:3002/api/orders', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                from_currency: "RUB", to_currency: "BTC", amount_give: 1000, amount_get: 0.01,
                user_wallet: "bc1...", from_network: "sber", to_network: "bitcoin"
            })
        });
        console.log("Valid amount:", await res.json());
    } catch(e) {
        console.error(e);
    } finally {
        server.close();
    }
});
