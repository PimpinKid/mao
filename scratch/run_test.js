const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const { generate, NobleCryptoPlugin, ScureBase32Plugin } = require('otplib');

const db = new sqlite3.Database('./crypto.db');
const dbRun = (sql, params = []) => new Promise((resolve, reject) => db.run(sql, params, function(err) { if (err) reject(err); else resolve(this); }));
const dbGet = (sql, params = []) => new Promise((resolve, reject) => db.get(sql, params, (err, row) => { if (err) reject(err); else resolve(row); }));
const dbAll = (sql, params = []) => new Promise((resolve, reject) => db.all(sql, params, (err, rows) => { if (err) reject(err); else resolve(rows); }));

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'mao_exchange_super_secret_jwt_key_2025';

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

const fs = require('fs');
const code = fs.readFileSync('scratch/api_security.js', 'utf8');
eval(code);

async function run() {
  const server = app.listen(0, async () => {
    const port = server.address().port;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNzkwNzU0MDQ3fQ.17r3Dyz6yfgwufjjYC2o7uF_dYpLYBpUVNm_ATKYkPc';
    
    console.log("--- POST 2FA Generate ---");
    let res = await fetch(`http://127.0.0.1:${port}/api/auth/2fa/generate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const generateRes = await res.json();
    console.log(generateRes);

    console.log("--- POST 2FA Enable ---");
    const validCode = await generate({ secret: generateRes.secret, crypto: new NobleCryptoPlugin(), base32: new ScureBase32Plugin() });
    res = await fetch(`http://127.0.0.1:${port}/api/auth/2fa/enable`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: validCode })
    });
    console.log(await res.json());

    console.log("--- GET TG Init ---");
    res = await fetch(`http://127.0.0.1:${port}/api/auth/telegram/init`, {
      method: 'GET'
    });
    const tgInit = await res.json();
    console.log(tgInit);
    
    console.log("--- GET TG Check (pending) ---");
    res = await fetch(`http://127.0.0.1:${port}/api/auth/telegram/check/${tgInit.code}`);
    console.log(await res.json());

    console.log("--- Simulate Bot Verifying Code ---");
    await dbRun("UPDATE auth_codes SET status = 'verified', user_id = 1 WHERE code = ?", [tgInit.code]);

    console.log("--- GET TG Check (verified) ---");
    res = await fetch(`http://127.0.0.1:${port}/api/auth/telegram/check/${tgInit.code}`);
    console.log(await res.json());

    server.close();
    process.exit(0);
  });
}
run();
