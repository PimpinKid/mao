import re

with open('server.js', 'r', encoding='utf-8') as f:
    js = f.read()

admin_get = """
app.get('/api/admin/p2p_deals/:id/messages', adminAuthMiddleware, async (req, res) => {
    try {
        const messages = await dbAll('SELECT * FROM p2p_messages WHERE deal_id = ? ORDER BY id ASC', [req.params.id]);
        res.json(messages);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});
"""

if "app.get('/api/admin/p2p_deals/:id/messages'" not in js:
    js = js.replace('// Admin toggle verified trader', admin_get + '\n// Admin toggle verified trader')
    with open('server.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Added GET endpoint to server.js")

with open('admin.html', 'r', encoding='utf-8') as f:
    admin_html = f.read()

admin_html = admin_html.replace('fetch(`/api/p2p/deals/${currentAdminDealId}/messages`, { headers: {\'x-admin-token\': getAdminToken(), ...getAuthHeaders()} })',
                                'fetch(`/api/admin/p2p_deals/${currentAdminDealId}/messages`, { headers: {\'x-admin-token\': getAdminToken()} })')

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(admin_html)
print("Patched admin.html")

