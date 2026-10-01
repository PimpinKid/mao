const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database('crypto.db');

const dbRun = (query, params = []) => new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve(this); // this.lastID, this.changes
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

// Insert api_classic.js
const fs = require('fs');
const apiCode = fs.readFileSync('scratch/api_classic.js', 'utf8');
eval(apiCode);

app.listen(3001, () => {
    console.log('Test server running');
});
