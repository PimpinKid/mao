const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const cards = html.split('<div class="p2p-bento-card"');
let replacedCount = 0;

for (let i = 1; i < cards.length; i++) {
    let card = cards[i];
    
    // Looser match, in case there is no ₽ or it's formatted differently
    const limitMatch = card.match(/<span>([\d\s]+)(?:[.,]\d+)?\s*~\s*([\d\s]+)(?:[.,]\d+)?/);
    
    if (limitMatch) {
        let minStr = limitMatch[1].replace(/\s/g, '').replace(/&nbsp;/g, '');
        let maxStr = limitMatch[2].replace(/\s/g, '').replace(/&nbsp;/g, '');
        let min = parseInt(minStr, 10);
        let max = parseInt(maxStr, 10);
        
        if (!isNaN(min) && !isNaN(max)) {
            const btnRegex = /openP2PCalculator\(([^)]+)\)/;
            const btnMatch = card.match(btnRegex);
            if (btnMatch) {
                let argsStr = btnMatch[1];
                let args = argsStr.split(',').map(s => s.trim());
                if (args.length >= 8 && args[6] === '5000') { // only fix ones that are still 5000
                    args[6] = min;
                    args[7] = max;
                    let newArgsStr = args.join(', ');
                    let newBtnStr = `openP2PCalculator(${newArgsStr})`;
                    cards[i] = card.replace(btnMatch[0], newBtnStr);
                    replacedCount++;
                }
            }
        }
    }
}

html = cards.join('<div class="p2p-bento-card"');
fs.writeFileSync('index.html', html);
console.log(`Pass 2 fixed ${replacedCount} more cards.`);
