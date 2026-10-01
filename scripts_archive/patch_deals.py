import re

with open('server.js', 'r', encoding='utf-8') as f:
    js = f.read()

bad = """        const { maker_name, rate, asset, fiat, type, amount_give, amount_get } = req.body;
        
        const result = await dbRun(
            'INSERT INTO p2p_deals (taker_id, amount_fiat, amount_crypto, maker_name, rate, asset, fiat, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, type==='sell'?amount_get:amount_give, type==='sell'?amount_give:amount_get, maker_name, rate, asset, fiat, type]
        );"""

good = """        const { maker_name, rate, asset, fiat, type, amount_give, amount_get } = req.body;
        
        // Security Fix: Validate deal amounts
        const parsedGive = parseFloat(amount_give);
        const parsedGet = parseFloat(amount_get);
        
        if (!type || !['buy', 'sell'].includes(type) || !maker_name || !asset || !fiat) {
            return res.status(400).json({ error: 'Некорректные параметры сделки' });
        }
        if (isNaN(parsedGive) || parsedGive <= 0 || isNaN(parsedGet) || parsedGet <= 0) {
            return res.status(400).json({ error: 'Некорректные числовые значения' });
        }

        const result = await dbRun(
            'INSERT INTO p2p_deals (taker_id, amount_fiat, amount_crypto, maker_name, rate, asset, fiat, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, type==='sell'?parsedGet:parsedGive, type==='sell'?parsedGive:parsedGet, maker_name, rate, asset, fiat, type]
        );"""

js = js.replace(bad, good)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Deals patched.")
