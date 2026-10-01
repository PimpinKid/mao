const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

const targetAdCode = `        if (isNaN(parsedPrice) || parsedPrice <= 0 || isNaN(parsedMin) || parsedMin <= 0 || isNaN(parsedMax) || parsedMax <= 0 || parsedMin > parsedMax) {
            return res.status(400).json({ error: 'Некорректные числовые значения для цены и лимитов' });
        }

        await dbRun(
            'INSERT INTO p2p_ads (maker_id, type, crypto, fiat, price, min_limit, max_limit, available_amount, payment_methods, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, type, crypto, fiat, parsedPrice, parsedMin, parsedMax, parseFloat(available_amount) || 0, JSON.stringify(payment_methods), 'pending']
        );`;

const replacementAdCode = `        if (isNaN(parsedPrice) || parsedPrice <= 0 || isNaN(parsedMin) || parsedMin <= 0 || isNaN(parsedMax) || parsedMax <= 0 || parsedMin > parsedMax) {
            return res.status(400).json({ error: 'Некорректные числовые значения для цены и лимитов' });
        }

        const parsedAmount = parseFloat(available_amount) || 0;

        await dbRun('BEGIN IMMEDIATE');

        if (type === 'sell') {
            const balanceCol = crypto.toLowerCase() + '_balance';
            // We verify balance for standard tokens (usdt, btc, eth)
            if (['usdt_balance', 'btc_balance', 'eth_balance'].includes(balanceCol)) {
                // Ensure column exists to avoid crash, if not we add it on the fly or just assume it exists
                try {
                    const userBal = await dbGet(\`SELECT \${balanceCol} FROM users WHERE id = ?\`, [req.user.id]);
                    if (!userBal || userBal[balanceCol] < parsedAmount) {
                        await dbRun('ROLLBACK');
                        return res.status(400).json({ error: 'Недостаточно средств на балансе для заморозки в Escrow' });
                    }
                    await dbRun(\`UPDATE users SET \${balanceCol} = \${balanceCol} - ? WHERE id = ?\`, [parsedAmount, req.user.id]);
                } catch(err) {
                    await dbRun('ROLLBACK');
                    return res.status(500).json({ error: 'Ошибка холдирования средств: колонка баланса отсутствует' });
                }
            }
        }

        await dbRun(
            'INSERT INTO p2p_ads (maker_id, type, crypto, fiat, price, min_limit, max_limit, available_amount, payment_methods, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, type, crypto, fiat, parsedPrice, parsedMin, parsedMax, parsedAmount, JSON.stringify(payment_methods), 'pending']
        );

        await dbRun('COMMIT');`;

content = content.replace(targetAdCode, replacementAdCode);
fs.writeFileSync('server.js', content);
