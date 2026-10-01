with open('index.html', 'r', encoding='utf-8') as f:
    js = f.read()

render_func = """
    // Load dynamic P2P ads
    function loadDynamicP2PAds() {
        fetch('/api/p2p/ads')
        .then(r=>r.json())
        .then(ads => {
            const grid = document.querySelector('.p2p-bento-grid');
            if(!grid) return;
            
            // Remove previously loaded dynamic ads
            document.querySelectorAll('.dynamic-p2p-ad').forEach(el => el.remove());
            
            ads.forEach(ad => {
                const isVerified = ad.is_verified_trader ? '<span style="color:var(--accent-orange); font-size:12px;">V</span>' : '';
                const pmHtml = ad.payment_methods ? JSON.parse(ad.payment_methods).map(pm => `<span class="bank-pill bank-sber">${pm}</span>`).join('') : '';
                const typeText = ad.type === 'sell' ? 'Продать' : 'Купить';
                
                const card = document.createElement('div');
                card.className = `p2p-bento-card dynamic-p2p-ad`;
                card.setAttribute('data-coin', ad.crypto);
                card.innerHTML = `
                    <div class="bento-card-top">
                        <div class="bento-avatar" style="background: rgba(255,255,255,0.05);">${ad.username.substring(0,2).toUpperCase()}</div>
                        <div class="bento-maker-info">
                            <div class="bento-name">${ad.username} ${isVerified}</div>
                            <div class="bento-stats">${ad.stats || '100% | 5 мин'}</div>
                        </div>
                        <div class="bento-price" style="margin-left: auto; text-align: right;">
                            <span style="font-size:20px; font-weight:700;">${ad.price}</span> <span style="color:var(--text-muted); font-size:14px;">${ad.fiat}</span>
                        </div>
                    </div>
                    <div class="bento-card-middle" style="margin-bottom: 20px;">
                        <div style="font-size:12px; color:var(--text-muted); margin-bottom:5px;">Лимиты</div>
                        <div style="font-size:13px;">${ad.min_limit} - ${ad.max_limit} ${ad.fiat}</div>
                    </div>
                    <div class="bento-card-bottom" style="align-items: flex-end;">
                        <div class="bento-banks">
                            ${pmHtml}
                        </div>
                        <button class="${ad.type === 'sell' ? 'bento-sell-btn' : 'bento-buy-btn'}" onclick="openP2PCalculator('${ad.username}', ${ad.price}, '${ad.crypto}', '${ad.fiat}', '${ad.type}')">${typeText} ${ad.crypto}</button>
                    </div>
                `;
                grid.insertBefore(card, grid.firstChild);
            });
            // Re-apply filters if any
            if(typeof filterP2POrders === 'function') filterP2POrders();
        })
        .catch(err => console.error("Error loading dynamic ads:", err));
    }
    
    // Call it on load
    document.addEventListener('DOMContentLoaded', loadDynamicP2PAds);
"""

if 'loadDynamicP2PAds' not in js:
    js = js.replace('function openP2PTrade()', render_func + '\n    function openP2PTrade()')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Injected dynamic ad rendering")

