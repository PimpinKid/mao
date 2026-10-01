const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

code = code.replace('// ==== END MODULES ====', `require('./telegram_bot.js')(app, io, dbGet, dbRun, dbAll, JWT_SECRET);\n// ==== END MODULES ====`);

// We also need to add notifications to deals!
// Find deal creation: const resDb = await dbRun(`INSERT INTO p2p_deals
code = code.replace(/(const resDb = await dbRun\(\`INSERT INTO p2p_deals[\s\S]*?\]\);)/, `$1\n                if (global.tgNotifyUser) global.tgNotifyUser(makerId, "⚡️ У вас новый ордер! Покупатель открыл сделку на " + amount_fiat + " RUB. У вас есть 15 минут.");`);

// Find deal paid: await dbRun('UPDATE p2p_deals SET status = \\'paid\\', escrow_step = \\'paid\\' WHERE id = ?', [dealId]);
code = code.replace(/await dbRun\('UPDATE p2p_deals SET status = \\'paid\\', escrow_step = \\'paid\\' WHERE id = \?', \[dealId\]\);/, `await dbRun('UPDATE p2p_deals SET status = \\'paid\\', escrow_step = \\'paid\\' WHERE id = ?', [dealId]);\n                const dealInfo = await dbGet('SELECT * FROM p2p_deals WHERE id = ?', [dealId]);\n                if (dealInfo && global.tgNotifyUser) global.tgNotifyUser(dealInfo.maker_id || dealInfo.user_id, "⏳ Покупатель отметил ордер #" + dealId + " как оплаченный! Проверьте поступление средств.");`);

fs.writeFileSync('server.js', code);
console.log('Server patched with Telegram Logic');
