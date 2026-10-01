const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const oldTickerFunc = `function renderTicker() {
        const track = document.getElementById('ticker-track');
        let html = '';
        const coinsToShow = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'DOGE', 'ADA', 'TRX', 'TON', 'AVAX', 'LINK', 'DOT'];
        const buildItems = () => {
            coinsToShow.forEach(coin => {
                if (livePrices[coin]) {
                    const priceStr = livePrices[coin] < 1 ? livePrices[coin].toFixed(4) : livePrices[coin].toFixed(2);
                    const iconData = currenciesData.find(c => c.code === coin);
                    const iconUrl = iconData ? iconData.icon : '';
                    html += \`<div class="ticker-item price-flash"><img src="\${iconUrl}"> <b>\${coin}</b> $\${priceStr}</div>\`;
                }
            });
        };
        buildItems(); buildItems();
        track.innerHTML = html;
    }`;

const newTickerFunc = `function renderTicker() {
        const track = document.getElementById('ticker-track');
        if (!track) return;
        const coinsToShow = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'DOGE', 'ADA', 'TRX', 'TON', 'AVAX', 'LINK', 'DOT'];
        
        // If track is empty, initialize DOM
        if (track.children.length === 0) {
            let html = '';
            const buildItems = () => {
                coinsToShow.forEach(coin => {
                    const iconData = currenciesData.find(c => c.code === coin);
                    const iconUrl = iconData ? iconData.icon : '';
                    html += \`<div class="ticker-item" data-coin="\${coin}">
                                <img src="\${iconUrl}"> 
                                <b>\${coin}</b> 
                                <span class="ticker-price">...</span>
                             </div>\`;
                });
            };
            // Duplicate 6 times to ensure it covers 4k/8k ultrawide monitors
            buildItems(); buildItems(); buildItems(); buildItems(); buildItems(); buildItems();
            track.innerHTML = html;
        }
        
        // Update prices smoothly without DOM thrashing
        const items = track.querySelectorAll('.ticker-item');
        items.forEach(item => {
            const coin = item.getAttribute('data-coin');
            if (livePrices[coin]) {
                const priceStr = livePrices[coin] < 1 ? livePrices[coin].toFixed(4) : livePrices[coin].toFixed(2);
                const priceSpan = item.querySelector('.ticker-price');
                const newText = '$' + priceStr;
                if (priceSpan.innerText !== newText) {
                    priceSpan.innerText = newText;
                    // Trigger flash animation
                    item.classList.remove('price-flash');
                    void item.offsetWidth; // trigger reflow
                    item.classList.add('price-flash');
                }
            }
        });
    }`;

content = content.replace(oldTickerFunc, newTickerFunc);

// Also add width: max-content to ticker-track css just in case
content = content.replace('.ticker-track { pointer-events: none !important; \n            display: inline-flex;', '.ticker-track { pointer-events: none !important; \n            display: inline-flex; width: max-content;');

fs.writeFileSync('index.html', content);
