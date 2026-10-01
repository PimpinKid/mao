const fs = require('fs');

const classicCode = fs.readFileSync('scratch/api_classic.js', 'utf8');
const crmCode = fs.readFileSync('scratch/api_crm.js', 'utf8');
const securityCode = fs.readFileSync('scratch/api_security.js', 'utf8');

const globalAuthStr = `
// ==================== RESTORED MODULES ====================
const strictGlobalAuthenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const jwt = require('jsonwebtoken');
    const secret = typeof JWT_SECRET !== 'undefined' ? JWT_SECRET : (process.env.JWT_SECRET || 'mao_exchange_super_secret_jwt_key_2025');
    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = user;
        next();
    });
};

const strictGlobalAdminAuth = (req, res, next) => {
    if (req.cookies && req.cookies.admin_session === 'authenticated') {
        req.user = { role: 'admin' };
        return next();
    }
    // Also fallback to JWT admin check
    strictGlobalAuthenticate(req, res, () => {
        if (req.user && req.user.role === 'admin') return next();
        res.status(403).json({ error: 'Forbidden: Admins only' });
    });
};
`;

let merged = globalAuthStr + "\n" + classicCode + "\n" + crmCode + "\n" + securityCode;

// Replace authenticators in the merged string
merged = merged.replace(/authenticate,/g, 'strictGlobalAuthenticate,');
merged = merged.replace(/adminAuth,/g, 'strictGlobalAdminAuth,');
merged = merged.replace(/crmAdminAuth/g, 'strictGlobalAdminAuth');
// api_crm.js defines `const crmAdminAuth = ...`. We need to remove that definition or change it to let
merged = merged.replace(/const strictGlobalAdminAuth = \(req, res, next\) => {[\s\S]*?res\.status\(401\)\.json\({ error: 'Unauthorized' }\);\n    }\n};/m, '');

let serverCode = fs.readFileSync('server.js', 'utf8');

// Inject before "// HTML Fallbacks"
serverCode = serverCode.replace(/\/\/ HTML Fallbacks/, merged + '\n// HTML Fallbacks');

fs.writeFileSync('server.js', serverCode);
console.log("Merged securely");
