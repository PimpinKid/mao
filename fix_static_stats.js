const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace "X исполнено | Y% | Zмин." with "X сделок • Y%"
html = html.replace(/>(\d+)\s*исполнено\s*\|\s*([\d\.]+)%\s*(?:\|\s*\d+мин\.)?</g, '>$1 сделок • $2%<');

// Also there are some like: 444 сделок • 97.5% - Wait, the task says: 1402 сделок • 99%
// Do we need to round? Let's leave float percentages alone if they are already in "X сделок • Y%" format or just fix the ones that don't match.
// The regex above handles the "исполнено" cases. Let's see if there are other variations.

fs.writeFileSync('index.html', html);
console.log('Done');
