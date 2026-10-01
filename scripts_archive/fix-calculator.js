const fs = require('fs');

const htmlPath = 'index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// The regex specifically looks for a string literal as the first argument, 
// so it safely ignores dynamic calls like openP2PCalculator(ad.id, ...)
const regex = /openP2PCalculator\('([^']+)',\s*([\d\.]+),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'\)/g;

let matches = 0;
const patchedHtml = html.replace(regex, (match, maker, price, crypto, fiat, action) => {
    matches++;
    return `openP2PCalculator(null, '${maker}', ${price}, '${crypto}', '${fiat}', '${action}', 5000, 1500000)`;
});

if (matches > 0) {
    fs.writeFileSync(htmlPath, patchedHtml);
    console.log(`Successfully patched ${matches} static P2P calls.`);
} else {
    console.log('No matching static P2P calls found.');
}
