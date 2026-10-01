const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// Require ad_id for all deals to prevent "ad_less" fake deals
content = content.replace(
    `if (!ad || ad.status !== 'approved') {`,
    `if (!ad || ad.status !== 'approved') {` // Keep as is
);
// Actually, earlier in deal creation:
// if (ad) { ... }
// const result = await dbRun('INSERT INTO ...', [ad ? ad.id : null, ...])
// If we just reject if !ad in deal creation:
content = content.replace(
    `if (ad) {
            // Re-fetch ad strictly inside transaction to prevent race conditions`,
    `if (!ad) { await dbRun('ROLLBACK'); return res.status(400).json({error: 'Объявление не найдено'}); }
        if (ad) {
            // Re-fetch ad strictly inside transaction to prevent race conditions`
);

// Release logic:
content = content.replace(
    `if (!ad || (ad.maker_id !== req.user.id && !req.isAdmin)) {`,
    `if (!ad || (ad.maker_id !== req.user.id && !req.isAdmin)) {` // It's fine if we require ad.
);

fs.writeFileSync('server.js', content);
