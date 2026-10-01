const sqlite3 = require('sqlite3');
const { promisify } = require('util');
const authAPI = require('./scratch/api_auth');
const fs = require('fs');

async function test() {
    fs.copyFileSync('crypto.db', 'test.db');
    const db = new sqlite3.Database('test.db');
    db.run = promisify(db.run.bind(db));
    db.get = promisify(db.get.bind(db));

    const { router } = authAPI(db, 'secret');

    async function mockRequest(method, url, body = {}) {
        return new Promise((resolve) => {
            const req = {
                method,
                url,
                body,
                headers: {}
            };
            const res = {
                status: function(code) { this.statusCode = code; return this; },
                json: function(data) { resolve({ status: this.statusCode || 200, data }); }
            };
            
            // simple mock router matching
            const layer = router.stack.find(l => l.route && l.route.path === url && l.route.methods[method.toLowerCase()]);
            if (layer) {
                layer.handle(req, res, (err) => { if(err) console.error(err); resolve({ status: 500, error: 'next called' }); });
            } else {
                resolve({ status: 404, error: 'Not found' });
            }
        });
    }

    try {
        console.log("Testing email register-init...");
        let out = await mockRequest('POST', '/auth/email/register-init', { email: 'test@example.com', password: 'password123' });
        console.log(out);

        const emailCode = await db.get("SELECT code FROM email_codes WHERE email = 'test@example.com'");
        console.log("Generated code:", emailCode);

        console.log("Testing email register-confirm...");
        out = await mockRequest('POST', '/auth/email/register-confirm', { email: 'test@example.com', code: emailCode.code });
        console.log(out);

        console.log("Testing forgot password init...");
        out = await mockRequest('POST', '/auth/email/forgot-init', { email: 'test@example.com' });
        console.log(out);

        const forgotCode = await db.get("SELECT code FROM email_codes WHERE email = 'test@example.com'");
        console.log("Forgot code:", forgotCode);
        
        console.log("Testing forgot password confirm...");
        out = await mockRequest('POST', '/auth/email/forgot-confirm', { email: 'test@example.com', code: forgotCode.code, newPassword: 'newpassword' });
        console.log(out);

    } catch(err) {
        console.error(err);
    } finally {
        db.close();
    }
}

test();
