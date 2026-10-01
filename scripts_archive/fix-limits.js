const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix ID in JS
html = html.replace("getElementById('p2p-calc-limits-val')", "getElementById('p2p-calc-limits-badge')");
html = html.replace("limitsEl.innerText = `${currentP2PMinLimit", "limitsEl.innerText = `Лимиты: ${currentP2PMinLimit");

// The span usually looks like: <span>40 000,00 ~ 2 000 000,00 ₽</span>
// Or maybe: <span>2000,00 ~ 69 982,98 ₽</span>
const cards = html.split('<div class="p2p-bento-card"');
let replacedCount = 0;

for (let i = 1; i < cards.length; i++) {
    let card = cards[i];
    
    // We look for limit text: <span>XXXX ~ YYYY ₽</span>
    // Note: spaces could be non-breaking spaces or regular spaces.
    const limitMatch = card.match(/<span>([\d\s]+)(?:[.,]\d+)?\s*~\s*([\d\s]+)(?:[.,]\d+)?\s*[₽]/);
    
    if (limitMatch) {
        let minStr = limitMatch[1].replace(/\s/g, '').replace(/&nbsp;/g, '');
        let maxStr = limitMatch[2].replace(/\s/g, '').replace(/&nbsp;/g, '');
        let min = parseInt(minStr, 10);
        let max = parseInt(maxStr, 10);
        
        if (!isNaN(min) && !isNaN(max)) {
            // Find openP2PCalculator in this card
            const btnRegex = /openP2PCalculator\(([^)]+)\)/;
            const btnMatch = card.match(btnRegex);
            if (btnMatch) {
                let argsStr = btnMatch[1];
                let args = argsStr.split(',').map(s => s.trim());
                if (args.length >= 8) {
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
console.log(`Updated ID logic and matched ${replacedCount} cards to fix real limits.`);
