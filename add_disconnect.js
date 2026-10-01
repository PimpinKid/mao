const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

const disconnectRoute = `
// Отвязка Web3 кошелька
app.post('/api/user/wallet/disconnect', authenticateToken, async (req, res) => {
    try {
        await dbRun('UPDATE users SET wallet_address = NULL, usdt_balance = 0 WHERE id = ?', [req.user.id]);
        req.io.to('admin_room').emit('user:wallet_update', { userId: req.user.id, wallet_address: null, usdt_balance: 0 });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
`;

if (!content.includes('/api/user/wallet/disconnect')) {
    content = content.replace(
        "app.post('/api/user/wallet', authenticateToken, async (req, res) => {",
        disconnectRoute + "\napp.post('/api/user/wallet', authenticateToken, async (req, res) => {"
    );
    fs.writeFileSync('server.js', content);
    console.log("Backend updated.");
} else {
    console.log("Backend already updated.");
}
