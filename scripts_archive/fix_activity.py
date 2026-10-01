import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Remove hardcoded rows
html = re.sub(
    r'<tbody id="activity-tbody">.*?</tbody>',
    '<tbody id="activity-tbody"></tbody>',
    html,
    flags=re.DOTALL
)

# 2. Add populateInitialActivity function right before generateRandomActivity
populate_script = """
    function populateInitialActivity() {
        const tbody = document.getElementById('activity-tbody');
        if (!tbody || Object.keys(livePrices).length < 5) {
            setTimeout(populateInitialActivity, 500);
            return;
        }
        for(let i=0; i<4; i++) {
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
            const timingText = currentLang === 'en' ? timingMapEn[i+1] : timingMapRu[i+1];
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><b>${fromAmount} ${fromCoin} → ${toCoin}</b></td>
                <td>${toAmount} ${toCoin}</td>
                <td><span class="status-badge ${stat.class}" data-stat-class="${stat.class}">${statTitle}</span></td>
                <td style="color: var(--text-muted);" data-timing-idx="${i+1}">${timingText}</td>
            `;
            tbody.appendChild(tr);
        }
        // start random generation loop
        setTimeout(generateRandomActivity, Math.floor(Math.random() * 5000) + 5000);
    }
"""

html = html.replace("    function generateRandomActivity() {", populate_script + "\n    function generateRandomActivity() {")

# 3. Find window.onload and instead of generateRandomActivity() -> we call it initially? 
# Wait, let's see if generateRandomActivity is called anywhere.
