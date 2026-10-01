const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

const topupEndpoint = `
// ==========================================
// API: FIAT DEPOSIT (TOPUP)
// ==========================================
app.post('/api/user/topup', authenticateToken, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount < 500) {
            return res.status(400).json({ success: false, error: 'Минимальная сумма пополнения 500 RUB' });
        }
        
        // В реальном проекте здесь будет запись в таблицу deposits
        const orderId = 'DEP-' + Math.floor(Math.random() * 1000000);
        
        // Отправляем админу уведомление о заявке (в сокет, если нужно)
        io.to('admin_room').emit('deposit:new', {
            userId: req.user.id,
            email: req.user.email,
            amount: amount,
            orderId: orderId,
            status: 'pending'
        });

        res.json({ success: true, orderId, message: 'Заявка успешно создана' });
    } catch (e) {
        console.error('Topup error:', e);
        res.status(500).json({ success: false, error: 'Ошибка сервера' });
    }
});
`;

content = content.replace('// --- APP INITIALIZATION ---', topupEndpoint + '\n\n// --- APP INITIALIZATION ---');
fs.writeFileSync('server.js', content);
