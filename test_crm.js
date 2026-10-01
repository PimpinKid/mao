const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { db, dbRun, dbGet, dbAll } = require('./database');
const http = require('http');

const app = express();
app.use(express.json());

// Mock middlewares
const authenticate = (req, res, next) => {
    if (req.headers.authorization === 'Bearer user') {
        req.user = { id: 1, role: 'user' };
        next();
    } else if (req.headers.authorization === 'Bearer admin') {
        req.user = { id: 2, role: 'admin' };
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

const adminAuth = (req, res, next) => {
    if (req.headers.authorization === 'Bearer admin') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Expose to main scope for the test script to pick up
global.app = app;
global.authenticate = authenticate;
global.adminAuth = adminAuth;
global.dbRun = dbRun;
global.dbGet = dbGet;
global.dbAll = dbAll;

// Load the CRM endpoints
const fs = require('fs');
const crmCode = fs.readFileSync('./scratch/api_crm.js', 'utf8');
eval(crmCode);

const server = http.createServer(app);
server.listen(0, async () => {
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;
    console.log(`Server started on port ${port}`);

    // Helper to run fetch
    const fetchJson = async (url, options) => {
        const fetch = (await import('node-fetch')).default || globalThis.fetch;
        const res = await fetch(url, options);
        return { status: res.status, body: await res.json() };
    };

    try {
        console.log("Running tests...");
        
        // 1. POST /api/support/messages (as guest)
        let res = await fetchJson(`${baseUrl}/api/support/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Hello as guest', guest_id: 'g1' })
        });
        console.log('Guest message:', res.status, res.body);

        // 2. POST /api/support/messages (as user)
        res = await fetchJson(`${baseUrl}/api/support/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer user' },
            body: JSON.stringify({ message: 'Hello as user' })
        });
        console.log('User message:', res.status, res.body);

        // 3. GET /api/admin/support/chats
        res = await fetchJson(`${baseUrl}/api/admin/support/chats`, {
            headers: { 'Authorization': 'Bearer admin' }
        });
        console.log('Admin chats:', res.status, res.body);
        
        // 4. GET /api/admin/support/messages/:chatId
        res = await fetchJson(`${baseUrl}/api/admin/support/messages/1`, {
            headers: { 'Authorization': 'Bearer admin' }
        });
        console.log('Admin messages for user 1:', res.status, res.body);
    } catch(err) {
        console.error(err);
    } finally {
        server.close();
        process.exit(0);
    }
});
