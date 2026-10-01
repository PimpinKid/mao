const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// Fix 1: Escrow Math Bug
// Replace: [amountFiat, ad.id, amountFiat] with [amountCrypto, ad.id, amountCrypto]
content = content.replace(
    /UPDATE p2p_ads SET available_amount = available_amount - \? WHERE id = \? AND available_amount >= \?',\s*\[amountFiat, ad.id, amountFiat\]/g,
    "UPDATE p2p_ads SET available_amount = available_amount - ? WHERE id = ? AND available_amount >= ?',\n                [amountCrypto, ad.id, amountCrypto]"
);

// Fix 3: Release Bug (Ad-less Deals)
// Currently: if (!ad || ad.maker_id !== req.user.id) throw new Error('Нет прав для отпуска монет');
// Need to handle if ad_id is null, meaning direct deal or deleted ad, wait, if ad_id is null, who is the maker?
// Let's check how /release is written.
