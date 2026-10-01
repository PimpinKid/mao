const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const populateScript = `
    function populateInitialActivity() {
        const tbody = document.getElementById('activity-tbody');
        if (!tbody || Object.keys(livePrices).length < 5) {
            setTimeout(populateInitialActivity, 500);
            return;
        }
        for(let i=0; i<7; i++) {
            let fromCoin = getRandomItem(popularCoins);
            let toCoin = getRandomItem(popularCoins);
            while (fromCoin === toCoin) { toCoin = getRandomItem(popularCoins); } 
            
            let fromAmount = 0;
            if (fromCoin === 'RUB') fromAmount = Math.floor(Math.random() * (300000 - 5000) + 5000); 
            else if (['BTC', 'ETH'].includes(fromCoin)) fromAmount = (Math.random() * 1.5 + 0.05).toFixed(4);
            else if (['USDT'].includes(fromCoin)) fromAmount = Math.floor(Math.random() * (5000 - 50) + 50);
            else fromAmount = (Math.random() * 50 + 1).toFixed(2);
            
            let toAmount = '...';
            const usdValue = fromAmount * livePrices[fromCoin];
            const res = usdValue / livePrices[toCoin];
            toAmount = res < 1 ? res.toFixed(5) : Math.floor(res);
            
            const stat = getWeightedStatus();
            const statTitle = currentLang === 'en' ? statusMapEn[stat.class] : statusMapRu[stat.class];
            const timingText = currentLang === 'en' ? (timingMapEn[i+1] || '10 min ago') : (timingMapRu[i+1] || '10 мин назад');
            
            const tr = document.createElement('tr');
            tr.innerHTML = \`
                <td><b>\${fromAmount} \${fromCoin} → \${toCoin}</b></td>
                <td>\${toAmount} \${toCoin}</td>
                <td><span class="status-badge \${stat.class}" data-stat-class="\${stat.class}">\${statTitle}</span></td>
                <td style="color: var(--text-muted);" data-timing-idx="\${i+1}">\${timingText}</td>
            \`;
            tbody.appendChild(tr);
        }
        setTimeout(generateRandomActivity, Math.floor(Math.random() * 5000) + 5000);
    }
`;

if (!html.includes('function populateInitialActivity()')) {
    html = html.replace('function generateRandomActivity() {', populateScript + '\\n    function generateRandomActivity() {');
    fs.writeFileSync('index.html', html);
    console.log("Injected populateInitialActivity successfully.");
} else {
    console.log("Already injected.");
}
