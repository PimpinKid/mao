with open('server.js', 'r', encoding='utf-8') as f:
    js = f.read()

bad = """        const { type, crypto, fiat, price, min_limit, max_limit, payment_methods } = req.body;
        await dbRun(
            'INSERT INTO p2p_ads (maker_id, type, crypto, fiat, price, min_limit, max_limit, payment_methods, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, type, crypto, fiat, price, min_limit, max_limit, JSON.stringify(payment_methods), 'pending']
        );"""

good = """        const { type, crypto, fiat, price, min_limit, max_limit, available_amount, payment_methods } = req.body;
        await dbRun(
            'INSERT INTO p2p_ads (maker_id, type, crypto, fiat, price, min_limit, max_limit, available_amount, payment_methods, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, type, crypto, fiat, price, min_limit, max_limit, available_amount || 0, JSON.stringify(payment_methods), 'pending']
        );"""

js = js.replace(bad, good)
with open('server.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("server.js patched")
