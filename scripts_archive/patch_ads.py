import re

with open('server.js', 'r', encoding='utf-8') as f:
    js = f.read()

bad = """        const { type, crypto, fiat, price, min_limit, max_limit, available_amount, payment_methods } = req.body;
        await dbRun(
            'INSERT INTO p2p_ads (maker_id, type, crypto, fiat, price, min_limit, max_limit, available_amount, payment_methods, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, type, crypto, fiat, price, min_limit, max_limit, available_amount || 0, JSON.stringify(payment_methods), 'pending']
        );"""

good = """        const { type, crypto, fiat, price, min_limit, max_limit, available_amount, payment_methods } = req.body;
        
        // Security Fix: Validate all fields
        const parsedPrice = parseFloat(price);
        const parsedMin = parseFloat(min_limit);
        const parsedMax = parseFloat(max_limit);
        
        if (!type || !['buy', 'sell'].includes(type) || !crypto || !fiat || !payment_methods || payment_methods.length === 0) {
            return res.status(400).json({ error: 'Заполните все обязательные поля' });
        }
        if (isNaN(parsedPrice) || parsedPrice <= 0 || isNaN(parsedMin) || parsedMin <= 0 || isNaN(parsedMax) || parsedMax <= 0 || parsedMin > parsedMax) {
            return res.status(400).json({ error: 'Некорректные числовые значения для цены и лимитов' });
        }

        await dbRun(
            'INSERT INTO p2p_ads (maker_id, type, crypto, fiat, price, min_limit, max_limit, available_amount, payment_methods, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, type, crypto, fiat, parsedPrice, parsedMin, parsedMax, parseFloat(available_amount) || 0, JSON.stringify(payment_methods), 'pending']
        );"""

js = js.replace(bad, good)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Ads patched.")
