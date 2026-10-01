const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const cards = html.split('<div class="p2p-bento-card"');
let replacedCount = 0;

for (let i = 1; i < cards.length; i++) {
    let card = cards[i];
    
    // Look for limits with ~, -, or —
    const limitMatch = card.match(/<span>([\d\s&nbsp;]+)(?:[.,]\d+)?\s*[~\-—]\s*([\d\s&nbsp;]+)(?:[.,]\d+)?\s*[₽P]/);
    
    if (limitMatch) {
        let minStr = limitMatch[1].replace(/[\s&nbsp;]/g, '').replace(/nbsp;/g, '');
        let maxStr = limitMatch[2].replace(/[\s&nbsp;]/g, '').replace(/nbsp;/g, '');
        let min = parseInt(minStr, 10);
        let max = parseInt(maxStr, 10);
        
        if (!isNaN(min) && !isNaN(max)) {
            const btnRegex = /openP2PCalculator\(([^)]+)\)/;
            const btnMatch = card.match(btnRegex);
            if (btnMatch) {
                let argsStr = btnMatch[1];
                // Careful splitting: strings might contain commas inside them (though openP2PCalculator shouldn't have commas inside strings here, but just in case)
                let args = argsStr.split(',').map(s => s.trim());
                if (args.length >= 8) {
                    args[6] = min;
                    args[7] = max;
                    let newArgsStr = args.join(', ');
                    let newBtnStr = `openP2PCalculator(${newArgsStr})`;
                    if (card !== card.replace(btnMatch[0], newBtnStr)) {
                        cards[i] = card.replace(btnMatch[0], newBtnStr);
                        replacedCount++;
                    }
                }
            }
        }
    }
}

html = cards.join('<div class="p2p-bento-card"');
fs.writeFileSync('index.html', html);
console.log(`Successfully updated limits on ${replacedCount} cards.`);
