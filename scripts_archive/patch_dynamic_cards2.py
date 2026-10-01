import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

bad_func = re.search(r"function loadDynamicP2PAds\(\) \{.*?\}\n    \n    // Call it on load", html, flags=re.DOTALL).group(0)

good_func = """function loadDynamicP2PAds() {
    fetch('/api/p2p/ads')
        .then(r => r.json())
        .then(data => {
            const gridBuy = document.getElementById('p2p-ads-grid-buy');
            const gridSell = document.getElementById('p2p-ads-grid-sell');
            if(!gridBuy || !gridSell) return;
            
            document.querySelectorAll('.dynamic-ad-card').forEach(el => el.remove());
            
            data.forEach(ad => {
                let pmHtml = '';
                try {
                    const pmArr = JSON.parse(ad.payment_methods);
                    pmArr.forEach(pm => {
                        let pmClass = '';
                        if(pm === 'Sberbank') pmClass = 'sber';
                        else if(pm === 'T-Bank') pmClass = 'tbank';
                        else if(pm === 'СБП') pmClass = 'sbp';
                        pmHtml += `<span class="bank-pill ${pmClass}">${pm === 'Sberbank' ? 'Сбербанк' : pm}</span> `;
                    });
                } catch(e) {}
                
                const isMakerSelling = (ad.type === 'sell');
                const typeText = isMakerSelling ? 'Купить' : 'Продать';
                
                const card = document.createElement('div');
                card.className = "p2p-bento-card dynamic-ad-card";
                card.setAttribute("data-coin", ad.crypto);
                
                const percent = Math.min(100, Math.max(0, (ad.max_limit / (ad.available_amount * ad.price)) * 100)) || 50;

                card.innerHTML = `
                    <div class="bento-card-top">
                        <div class="bento-avatar" style="background: rgba(255,255,255,0.05);">${ad.username.charAt(0).toUpperCase()}</div>
                        <div class="bento-merchant">
                            <div class="bento-name">${ad.username}${ad.is_verified_trader ? '<span class="pro-badge">V</span>' : ''}</div>
                            <div class="bento-stats">99.5% | 12 мин</div>
                        </div>
                    </div>
                    
                    <div class="bento-price-section">
                        <div class="bento-price-label">Курс обмена</div>
                        <div class="bento-price-value">${ad.price.toFixed(2)} <span>RUB</span></div>
                    </div>

                    <div class="bento-limits">
                        <div class="limit-bar-bg"><div class="limit-bar-fill" style="width: ${percent}%;"></div></div>
                        <div class="limit-text">
                            <span>Доступно: ${ad.available_amount ? ad.available_amount.toFixed(2) : '0.00'} ${ad.crypto}</span>
                            <span>${ad.min_limit.toLocaleString('ru-RU')} - ${ad.max_limit.toLocaleString('ru-RU')} ₽</span>
                        </div>
                    </div>

                    <div class="bento-card-bottom">
                        <div class="bento-banks">
                            ${pmHtml}
                        </div>
                        <button class="${isMakerSelling ? 'bento-buy-btn' : 'bento-sell-btn'}" onclick="openP2PCalculator('${ad.username}', ${ad.price}, '${ad.crypto}', '${ad.fiat}', '${ad.type}')">${typeText} ${ad.crypto}</button>
                    </div>
                `;
                
                const grid = isMakerSelling ? gridBuy : gridSell;
                grid.insertBefore(card, grid.firstChild);
            });
            // Re-apply filters if any
            if(typeof filterP2POrders === 'function') filterP2POrders();
        })
        .catch(err => console.error("Error loading dynamic ads:", err));
}
    
    // Call it on load"""

html = html.replace(bad_func, good_func)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("index.html loadDynamicP2PAds rewritten")
