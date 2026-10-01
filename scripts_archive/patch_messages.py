import re

with open('server.js', 'r', encoding='utf-8') as f:
    js = f.read()

bad_get_msgs = """app.get('/api/p2p/deals/:id/messages', async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Необходима авторизация' });
        const messages = await dbAll('SELECT * FROM p2p_messages WHERE deal_id = ? ORDER BY id ASC', [req.params.id]);"""

good_get_msgs = """app.get('/api/p2p/deals/:id/messages', async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Необходима авторизация' });
        const deal = await dbGet('SELECT * FROM p2p_deals WHERE id = ?', [req.params.id]);
        if (!deal) return res.status(404).json({ error: 'Сделка не найдена' });
        // Security Fix: Allow taker or admin (maker identity logic is incomplete, so we allow taker)
        if (deal.taker_id !== req.user.id && !req.isAdmin) return res.status(403).json({ error: 'Доступ запрещен' });
        const messages = await dbAll('SELECT * FROM p2p_messages WHERE deal_id = ? ORDER BY id ASC', [req.params.id]);"""

bad_post_msgs = """app.post('/api/p2p/deals/:id/messages', async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Необходима авторизация' });
        const { message } = req.body;
        if (!message || !message.trim()) return res.status(400).json({ error: 'Пустое сообщение' });"""

good_post_msgs = """app.post('/api/p2p/deals/:id/messages', async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Необходима авторизация' });
        const deal = await dbGet('SELECT * FROM p2p_deals WHERE id = ?', [req.params.id]);
        if (!deal) return res.status(404).json({ error: 'Сделка не найдена' });
        if (deal.taker_id !== req.user.id && !req.isAdmin) return res.status(403).json({ error: 'Доступ запрещен' });
        const { message } = req.body;
        if (!message || !message.trim()) return res.status(400).json({ error: 'Пустое сообщение' });"""

js = js.replace(bad_get_msgs, good_get_msgs)
js = js.replace(bad_post_msgs, good_post_msgs)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Messages patched.")
