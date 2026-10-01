import re

with open('server.js', 'r', encoding='utf-8') as f:
    js = f.read()

bad = """app.get('/api/admin/p2p_deals', adminAuthMiddleware, async (req, res) => {
    try {
        const deals = await dbAll(`
            SELECT d.*, a.type, a.crypto, a.fiat, a.price, u.email as taker_email, u.display_name as taker_name 
            FROM p2p_deals d 
            JOIN p2p_ads a ON d.ad_id = a.id 
            JOIN users u ON d.taker_id = u.id 
            ORDER BY d.id DESC
        `);"""

good = """app.get('/api/admin/p2p_deals', adminAuthMiddleware, async (req, res) => {
    try {
        const deals = await dbAll(`
            SELECT d.*, u.email as taker_email, u.display_name as taker_name 
            FROM p2p_deals d 
            JOIN users u ON d.taker_id = u.id 
            ORDER BY d.id DESC
        `);"""

if bad in js:
    js = js.replace(bad, good)
    print("Replaced admin deals successfully")
else:
    print("Failed to replace admin deals")

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(js)
