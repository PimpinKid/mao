const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

const target = "app.get('/api/admin/users', async (req, res) => {\n    try {\n        if (!req.user || req.user.role !== 'admin') {\n            return res.status(403).json({ error: 'Требуются права администратора' });\n        }";

const replacement = "app.get('/api/admin/users', adminAuthMiddleware, async (req, res) => {\n    try {";

server = server.replace(target, replacement);

fs.writeFileSync('server.js', server);
