const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

const top = lines.slice(0, 4215).join('\n');
const bottom = lines.slice(11401).join('\n'); // 11401 is index 11401 which is line 11402 (1-based)

const renderTicker = `
    function renderTicker() {
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
            buildItems(); buildItems(); buildItems(); buildItems(); buildItems(); buildItems();
            track.innerHTML = html;
        }
        
        const items = track.querySelectorAll('.ticker-item');
        items.forEach(item => {
            const coin = item.getAttribute('data-coin');
            if (livePrices[coin]) {
                const priceStr = livePrices[coin] < 1 ? livePrices[coin].toFixed(4) : livePrices[coin].toFixed(2);
                const priceSpan = item.querySelector('.ticker-price');
                const newText = '$' + priceStr;
                if (priceSpan.innerText !== newText) {
                    priceSpan.innerText = newText;
                    item.classList.remove('price-flash');
                    void item.offsetWidth;
                    item.classList.add('price-flash');
                }
            }
        });
    }
`;

fs.writeFileSync('index.html', top + '\n' + renderTicker + '\n' + bottom);
