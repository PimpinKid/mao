const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

content = content.replace(
    /'UPDATE p2p_ads SET available_amount = available_amount - \? WHERE id = \? AND available_amount >= \?',\s*\[amountFiat, ad.id, amountFiat\]/g,
    "'UPDATE p2p_ads SET available_amount = available_amount - ? WHERE id = ? AND available_amount >= ?',\n                [amountCrypto, ad.id, amountCrypto]"
);
content = content.replace(
    /\[deal\.amount_fiat, deal\.ad_id\]/g,
    "[deal.amount_crypto, deal.ad_id]"
);

fs.writeFileSync('server.js', content);
