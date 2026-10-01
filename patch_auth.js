const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const regex = /const strictGlobalAuthenticate = \(req, res, next\) => \{[\s\S]*?next\(\);\n    \}\);\n\};/m;

const replacement = `const strictGlobalAuthenticate = (req, res, next) => {
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
};`;

code = code.replace(regex, replacement);
fs.writeFileSync('server.js', code);
