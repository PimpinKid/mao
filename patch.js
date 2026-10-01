const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

code = code.replace(
    /await dbRun\(query, \[userId, type, crypto, fiat, price, min_limit, max_limit, JSON\.stringify\(payment_methods\), available_amount\]\);\s*\}\);\s*res\.json\(\{ success: true \}\);/,
    `const result = await dbRun(query, [userId, type, crypto, fiat, price, min_limit, max_limit, JSON.stringify(payment_methods), available_amount]);
                return result.lastID;
            });
            
            res.json({ success: true, id: newAdId });`
).replace(
    /await runInTx\(async \(\) => \{/,
    `const newAdId = await runInTx(async () => {`
);

fs.writeFileSync('server.js', code);
