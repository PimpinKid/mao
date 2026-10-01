with open('server.js', 'r', encoding='utf-8') as f:
    js = f.read()

bad1 = "app.get('/api/admin/p2p_ads', async (req, res) => {\n    try {\n        if (!req.user || !req.user.is_admin) return res.status(403).json({ error: 'Forbidden' });"
good1 = "app.get('/api/admin/p2p_ads', adminAuthMiddleware, async (req, res) => {\n    try {"

bad2 = "app.post('/api/admin/p2p_ads/:id/moderate', async (req, res) => {\n    try {\n        if (!req.user || !req.user.is_admin) return res.status(403).json({ error: 'Forbidden' });"
good2 = "app.post('/api/admin/p2p_ads/:id/moderate', adminAuthMiddleware, async (req, res) => {\n    try {"

if bad1 in js:
    js = js.replace(bad1, good1)
if bad2 in js:
    js = js.replace(bad2, good2)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(js)
