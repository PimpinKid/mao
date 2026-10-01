const fs = require('fs');

const htmlPath = 'index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// Regex for 4-argument calls: openP2PCalculator('Name', 85.00, 'USDT', 'RUB')
const regex4 = /openP2PCalculator\('([^']+)',\s*([\d\.]+),\s*'([^']+)',\s*'([^']+)'\)/g;

let matches = 0;
const patchedHtml = html.replace(regex4, (match, maker, price, crypto, fiat) => {
    matches++;
    // Defaulting action to 'sell' since these are mostly on the 'Купить' tab where Maker is selling,
    // though the activeTab logic inside the function handles the final display anyway.
    return `openP2PCalculator(null, '${maker}', ${price}, '${crypto}', '${fiat}', 'sell', 5000, 1500000)`;
});

if (matches > 0) {
    fs.writeFileSync(htmlPath, patchedHtml);
    console.log(`Successfully patched ${matches} 4-arg static P2P calls.`);
} else {
    console.log('No matching 4-arg static P2P calls found.');
}
