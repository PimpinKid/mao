const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const regex = /\/\/ ==================== REVIEWS API ====================[\s\S]*?app\.post\('\/api\/reviews', authenticate, \(req, res\) => \{[\s\S]*?\}\);\s*/;

const newEndpoints = `// ==================== REVIEWS API ====================
const reviewsAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = user;
        next();
    });
};

app.get('/api/reviews/preview', async (req, res) => {
    try {
        const rows = await dbAll("SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT 3");
        res.json({ reviews: rows });
    } catch(err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

app.get('/api/reviews', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const offset = (page - 1) * limit;

    try {
        const row = await dbGet("SELECT COUNT(*) as cnt FROM reviews WHERE status = 'approved'");
        const totalPages = Math.ceil(row.cnt / limit);
        const rows = await dbAll("SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT ? OFFSET ?", [limit, offset]);
        res.json({ reviews: rows, totalPages });
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

app.post('/api/reviews', reviewsAuth, async (req, res) => {
    const { text } = req.body;
    if (!text || text.trim().length < 5) return res.status(400).json({ error: 'Review too short' });

    try {
        await dbRun("INSERT INTO reviews (user_id, author, text, status) VALUES (?, ?, ?, 'pending')", 
            [req.user.id, req.user.username || 'Пользователь', text.trim()]);
        res.json({ success: true, message: 'Review submitted for moderation' });
    } catch(err) {
        res.status(500).json({ error: 'DB Error' });
    }
});
`;

code = code.replace(regex, newEndpoints);
fs.writeFileSync('server.js', code);
console.log('Reviews API fixed');
