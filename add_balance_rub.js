const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// 1. Database schema update
const schemaUpdate = `
        try { await dbRun("ALTER TABLE users ADD COLUMN balance_rub REAL DEFAULT 0"); } catch(e){}
`;
if (!content.includes('balance_rub REAL DEFAULT 0')) {
    content = content.replace(
        "try { await dbRun(\"ALTER TABLE users ADD COLUMN usdt_balance REAL DEFAULT 0\"); } catch(e){}",
        "try { await dbRun(\"ALTER TABLE users ADD COLUMN usdt_balance REAL DEFAULT 0\"); } catch(e){}\n" + schemaUpdate
    );
}

// 2. Admin API for balances
const adminApi = `
// ==================== BALANCES API ====================
app.get('/api/admin/balances', adminAuthMiddleware, async (req, res) => {
    try {
        const users = await dbAll('SELECT id, email, display_name, balance_rub FROM users ORDER BY id DESC');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/admin/balances/:id', adminAuthMiddleware, async (req, res) => {
    try {
        const { balance_rub } = req.body;
        await dbRun('UPDATE users SET balance_rub = ? WHERE id = ?', [parseFloat(balance_rub) || 0, req.params.id]);
        
        // Notify the user in real-time
        io.to(String(req.params.id)).emit('user:balance_update', { balance_rub: parseFloat(balance_rub) || 0 });
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
`;

if (!content.includes('/api/admin/balances')) {
    content = content.replace(
        "// ==================== ADMIN CRM API (ЗАЩИЩЕННЫЕ) ====================",
        "// ==================== ADMIN CRM API (ЗАЩИЩЕННЫЕ) ====================\n" + adminApi
    );
}

fs.writeFileSync('server.js', content);
