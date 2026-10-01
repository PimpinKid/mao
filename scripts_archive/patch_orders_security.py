import re

with open('server.js', 'r', encoding='utf-8') as f:
    js = f.read()

bad_get = """app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await dbGet('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        if (!order) return res.status(404).json({ error: 'Ордер не найден' });
        res.json(order);"""

good_get = """app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await dbGet('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        if (!order) return res.status(404).json({ error: 'Ордер не найден' });
        
        // Security Fix: Ensure user owns the order
        const isOwner = (req.user && req.user.id === order.user_id) || (req.guestId && req.guestId === order.guest_id);
        if (!isOwner && !req.isAdmin) {
            return res.status(403).json({ error: 'Доступ запрещен' });
        }
        
        res.json(order);"""

bad_post = """app.post('/api/orders/:id/pay', async (req, res) => {
    try {
        const order = await dbGet('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        if (!order) return res.status(404).json({ error: 'Ордер не найден' });

        await dbRun(`UPDATE orders SET status = 'paid' WHERE id = ?`, [req.params.id]);"""

good_post = """app.post('/api/orders/:id/pay', async (req, res) => {
    try {
        const order = await dbGet('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        if (!order) return res.status(404).json({ error: 'Ордер не найден' });

        // Security Fix: Ensure user owns the order
        const isOwner = (req.user && req.user.id === order.user_id) || (req.guestId && req.guestId === order.guest_id);
        if (!isOwner && !req.isAdmin) {
            return res.status(403).json({ error: 'Доступ запрещен' });
        }

        await dbRun(`UPDATE orders SET status = 'paid' WHERE id = ?`, [req.params.id]);"""

js = js.replace(bad_get, good_get)
js = js.replace(bad_post, good_post)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Orders security patched.")
