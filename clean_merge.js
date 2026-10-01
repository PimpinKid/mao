const fs = require('fs');
let serverCode = fs.readFileSync('server.js', 'utf8');

// Strip old injected code
serverCode = serverCode.replace(/\/\/ ==================== RESTORED MODULES ====================[\s\S]*?\/\/ HTML Fallbacks/, '// HTML Fallbacks');

const classicCode = fs.readFileSync('scratch/api_classic.js', 'utf8');
const crmCode = fs.readFileSync('scratch/api_crm.js', 'utf8');
const securityCode = fs.readFileSync('scratch/api_security.js', 'utf8');

const globalAuthStr = `
// ==================== RESTORED MODULES ====================
const strictGlobalAuthenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
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
    strictGlobalAuthenticate(req, res, () => {
        if (req.user && req.user.role === 'admin') return next();
        res.status(403).json({ error: 'Forbidden: Admins only' });
    });
};
`;

let merged = globalAuthStr + "\n" + classicCode + "\n" + crmCode + "\n" + securityCode;

// Safely replace the placeholders without greedy regex!
// In api_classic.js and api_security.js, they use "authenticate" and "adminAuth"
// We want to replace these with "strictGlobalAuthenticate" and "strictGlobalAdminAuth"
// But only for the route registrations:
merged = merged.replace(/app\.(get|post|delete)\('([^']+)', authenticate,/g, "app.$1('$2', strictGlobalAuthenticate,");
merged = merged.replace(/app\.(get|post|delete)\('([^']+)', adminAuth,/g, "app.$1('$2', strictGlobalAdminAuth,");

// In api_crm.js, crmAdminAuth is declared and used. Let's just remove the declaration of crmAdminAuth
// and replace its usage.
merged = merged.replace(/const crmAdminAuth = \([\s\S]*?res\.status\(401\)\.json\({ error: 'Unauthorized' }\);\n    }\n};/m, '');
merged = merged.replace(/crmAdminAuth/g, 'strictGlobalAdminAuth');

// Put it back in serverCode
serverCode = serverCode.replace(/\/\/ HTML Fallbacks/, merged + '\n// HTML Fallbacks');

fs.writeFileSync('server.js', serverCode);
console.log("Cleanly merged without greedy regex bugs!");
