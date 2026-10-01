const fs = require('fs');

let serverCode = fs.readFileSync('server.js', 'utf8');

const newRoutes = `
// ==================== P2P DEALS (TAKER CHAT) ====================

app.post('/api/p2p/deals', async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Необходима авторизация' });
        const { ad_id, amount_fiat, amount_crypto } = req.body;
        
        const ad = await dbGet('SELECT * FROM p2p_ads WHERE id = ?', [ad_id]);
        if (!ad) return res.status(404).json({ error: 'Объявление не найдено' });

        const result = await dbRun(
            'INSERT INTO p2p_deals (ad_id, taker_id, amount_fiat, amount_crypto) VALUES (?, ?, ?, ?)',
            [ad_id, req.user.id, amount_fiat, amount_crypto]
        );
        
        res.json({ success: true, deal_id: result.lastID });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/p2p/deals/:id/messages', async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Необходима авторизация' });
        const messages = await dbAll('SELECT * FROM p2p_messages WHERE deal_id = ? ORDER BY id ASC', [req.params.id]);
        res.json(messages);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/p2p/deals/:id/messages', async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Необходима авторизация' });
        const { message } = req.body;
        if (!message || !message.trim()) return res.status(400).json({ error: 'Пустое сообщение' });

        await dbRun(
            'INSERT INTO p2p_messages (deal_id, sender_type, message) VALUES (?, ?, ?)',
            [req.params.id, 'taker', message.trim()]
        );
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// Admin routes for deals
app.get('/api/admin/p2p_deals', adminAuthMiddleware, async (req, res) => {
    try {
        const deals = await dbAll(\`
            SELECT d.*, a.type, a.crypto, a.fiat, a.price, u.email as taker_email, u.display_name as taker_name 
            FROM p2p_deals d 
            JOIN p2p_ads a ON d.ad_id = a.id 
            JOIN users u ON d.taker_id = u.id 
            ORDER BY d.id DESC
        \`);
        res.json(deals);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/admin/p2p_deals/:id/messages', adminAuthMiddleware, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || !message.trim()) return res.status(400).json({ error: 'Пустое сообщение' });

        await dbRun(
            'INSERT INTO p2p_messages (deal_id, sender_type, message) VALUES (?, ?, ?)',
            [req.params.id, 'maker_admin', message.trim()]
        );
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// Admin toggle verified trader
app.post('/api/admin/users/:id/verify_trader', adminAuthMiddleware, async (req, res) => {
    try {
        const user = await dbGet('SELECT is_verified_trader FROM users WHERE id = ?', [req.params.id]);
        if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
        const newState = user.is_verified_trader ? 0 : 1;
        await dbRun('UPDATE users SET is_verified_trader = ? WHERE id = ?', [newState, req.params.id]);
        res.json({ success: true, is_verified_trader: newState });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// ==================== END P2P DEALS ====================
`;

if (!serverCode.includes('/api/p2p/deals')) {
    serverCode = serverCode.replace('// ==================== TELEGRAM BOT API', newRoutes + '\n// ==================== TELEGRAM BOT API');
    fs.writeFileSync('server.js', serverCode);
    console.log("Added routes to server.js");
} else {
    console.log("Routes already exist");
}
