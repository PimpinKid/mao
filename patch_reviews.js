const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const endpoints = `
// ==================== REVIEWS API ====================
app.get('/api/reviews/preview', (req, res) => {
    dbAll("SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT 3", [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'DB Error' });
        res.json({ reviews: rows });
    });
});

app.get('/api/reviews', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const offset = (page - 1) * limit;

    dbGet("SELECT COUNT(*) as cnt FROM reviews WHERE status = 'approved'", [], (err, row) => {
        if (err) return res.status(500).json({ error: 'DB Error' });
        const totalPages = Math.ceil(row.cnt / limit);

        dbAll("SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT ? OFFSET ?", [limit, offset], (err, rows) => {
            if (err) return res.status(500).json({ error: 'DB Error' });
            res.json({ reviews: rows, totalPages });
        });
    });
});

app.post('/api/reviews', authenticateToken, (req, res) => {
    const { text } = req.body;
    if (!text || text.trim().length < 5) return res.status(400).json({ error: 'Review too short' });

    dbRun("INSERT INTO reviews (user_id, author, text, status) VALUES (?, ?, ?, 'pending')", 
        [req.user.id, req.user.username || 'Пользователь', text.trim()], function(err) {
        if (err) return res.status(500).json({ error: 'DB Error' });
        res.json({ success: true, message: 'Review submitted for moderation' });
    });
});
`;

// Insert the endpoints before the start of the telegram bot injection or error handler
const insertPoint = /app\.use\(\(err, req, res, next\) => \{/;
code = code.replace(insertPoint, endpoints + '\napp.use((err, req, res, next) => {');

fs.writeFileSync('server.js', code);
console.log('Reviews endpoints added to server.js');
