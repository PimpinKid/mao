
let currentP2PCoin = 'USDT';
let currentP2PPage = 1;
const p2pItemsPerPage = 24;

function toggleP2PCoin(coin) {
    currentP2PCoin = coin;
    document.getElementById('btn-coin-usdt').classList.remove('active');
    document.getElementById('btn-coin-btc').classList.remove('active');
    document.getElementById('btn-coin-eth').classList.remove('active');
    document.getElementById('btn-coin-' + coin.toLowerCase()).classList.add('active');
    currentP2PPage = 1;
    filterP2POrders();
}

function filterP2POrders() {
    const paymentFilter = document.getElementById('p2p-payment-filter').value.toLowerCase();
    
    const activeTab = document.getElementById('btn-buy-tab').classList.contains('active') ? 'buy' : 'sell';
    const gridId = activeTab === 'buy' ? 'p2p-ads-grid-buy' : 'p2p-ads-grid-sell';
    
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    const cards = Array.from(grid.querySelectorAll('.p2p-bento-card'));
    let filteredCards = [];
    
    cards.forEach(card => {
        let show = true;
        
        // Filter by Coin
        if (card.getAttribute('data-coin') !== currentP2PCoin) {
            show = false;
        }
        
        // Filter by Payment Method
        if (paymentFilter) {
            const banksStr = card.getAttribute('data-banks') || '';
            const banks = banksStr.toLowerCase().split(',');
            if (!banks.includes(paymentFilter)) {
                show = false;
            }
        }
        
        if (show) {
            filteredCards.push(card);
        } else {
            card.style.display = 'none';
        }
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredCards.length / p2pItemsPerPage) || 1;
    if (currentP2PPage > totalPages) currentP2PPage = totalPages;

    const startIndex = (currentP2PPage - 1) * p2pItemsPerPage;
    const endIndex = startIndex + p2pItemsPerPage;

    filteredCards.forEach((card, index) => {
        if (index >= startIndex && index < endIndex) {
            card.style.display = 'flex'; // Changed to flex for proper internal layout
        } else {
            card.style.display = 'none';
        }
    });


    let emptyState = document.getElementById('p2p-empty-state-' + gridId);
    if (filteredCards.length === 0) {
        if (!emptyState) {
            emptyState = document.createElement('div');
            emptyState.id = 'p2p-empty-state-' + gridId;
            emptyState.style.cssText = 'grid-column: 1 / -1; padding: 60px 20px; text-align: center; color: var(--text-muted); background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 20px;';
            emptyState.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 15px; opacity: 0.5;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><h3 style="color: #fff; margin-bottom: 5px; font-weight: 600;">Объявления не найдены</h3><p style="font-size: 13px;">Попробуйте изменить фильтры (валюту или способ оплаты)</p>';
            grid.appendChild(emptyState);
        }
        emptyState.style.display = 'block';
    } else {
        if (emptyState) emptyState.style.display = 'none';
    }

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    let container = document.getElementById('p2p-pagination');
    if (!container) {
        container = document.createElement('div');
        container.id = 'p2p-pagination';
        container.className = 'pagination-controls';
        container.style.cssText = 'display: flex; justify-content: center; gap: 10px; margin-top: 30px;';
        
        // Append to the wrapper that contains both grids
        const wrapper = document.getElementById('p2p-ads-grid-buy').parentNode;
        wrapper.appendChild(container);
    }

    container.innerHTML = '';
    if (totalPages <= 1) return; // No pagination needed

    // Prev Button
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '← Назад';
    prevBtn.className = 'btn-outline';
    prevBtn.style.cssText = `padding: 8px 16px; min-height: 44px; min-width: 44px; display: flex; align-items: center; justify-content: center; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #fff; cursor: ${currentP2PPage === 1 ? 'not-allowed' : 'pointer'}; opacity: ${currentP2PPage === 1 ? '0.5' : '1'}; transition: 0.2s;`;
    if (currentP2PPage > 1) {
        prevBtn.onclick = () => { currentP2PPage--; filterP2POrders(); document.getElementById('p2p-tab-content').scrollIntoView({behavior: 'smooth'}); };
    }
    container.appendChild(prevBtn);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.innerHTML = i;
        pageBtn.className = 'btn-outline';
        const isActive = (i === currentP2PPage);
        pageBtn.style.cssText = `padding: 8px 14px; min-height: 44px; min-width: 44px; display: flex; align-items: center; justify-content: center; border-radius: 4px; border: 1px solid ${isActive ? 'var(--accent-orange)' : 'rgba(255,255,255,0.1)'}; background: ${isActive ? 'var(--accent-orange)' : 'rgba(255,255,255,0.05)'}; color: ${isActive ? '#12141a' : '#fff'}; cursor: pointer; transition: 0.2s; font-weight: ${isActive ? 'bold' : 'normal'};`;
        pageBtn.onclick = () => { currentP2PPage = i; filterP2POrders(); document.getElementById('p2p-tab-content').scrollIntoView({behavior: 'smooth'}); };
        container.appendChild(pageBtn);
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = 'Вперед →';
    nextBtn.className = 'btn-outline';
    nextBtn.style.cssText = `padding: 8px 16px; min-height: 44px; min-width: 44px; display: flex; align-items: center; justify-content: center; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #fff; cursor: ${currentP2PPage === totalPages ? 'not-allowed' : 'pointer'}; opacity: ${currentP2PPage === totalPages ? '0.5' : '1'}; transition: 0.2s;`;
    if (currentP2PPage < totalPages) {
        nextBtn.onclick = () => { currentP2PPage++; filterP2POrders(); document.getElementById('p2p-tab-content').scrollIntoView({behavior: 'smooth'}); };
    }
    container.appendChild(nextBtn);
}

function toggleP2PTab(tab) {
    // Buttons
    document.getElementById('btn-buy-tab').classList.remove('active');
    document.getElementById('btn-sell-tab').classList.remove('active');
    
    // Grids
    document.getElementById('p2p-ads-grid-buy').style.display = 'none';
    document.getElementById('p2p-ads-grid-sell').style.display = 'none';
    
    if(tab === 'buy') {
        document.getElementById('btn-buy-tab').classList.add('active');
        document.getElementById('p2p-ads-grid-buy').style.display = 'grid';
    } else {
        document.getElementById('btn-sell-tab').classList.add('active');
        document.getElementById('p2p-ads-grid-sell').style.display = 'grid';
    }
    
    // Apply filters immediately to the active tab
    filterP2POrders();
}
