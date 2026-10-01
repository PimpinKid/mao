
    // ОБНОВЛЕННЫЕ ИКОНКИ ДЛЯ ФИАТА В КРУГЛОМ, АККУРАТНОМ ВЕКТОРНОМ СТИЛЕ (SVG DATA-URI)
    const sberIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%231f242d'/><path d='M50 22 C34.5 22 22 34.5 22 50 C22 65.5 34.5 78 50 78 C65.5 78 78 65.5 78 50' fill='none' stroke='%232ebd85' stroke-width='7' stroke-linecap='round'/><path d='M35 48 L46 59 L68 37' fill='none' stroke='%232ebd85' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'/></svg>";
    
    const tbankIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%231f242d'/><circle cx='50' cy='50' r='48' fill='none' stroke='%23ffdd2d' stroke-width='3'/><path d='M28 32 H72 V42 H56 V75 H44 V42 H28 Z' fill='%23ffdd2d'/></svg>";
    
    const alfaIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%231f242d'/><path d='M50 22 L24 74 H37 L43 61 H57 L63 74 H76 L50 22 Z M47 51 L50 42 L53 51 H47 Z' fill='%23ef4444'/><rect x='28' y='77' width='44' height='5' rx='2.5' fill='%23ef4444'/></svg>";
    
    const sbpIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%231f242d'/><path d='M50 22 L75 42 L65 74 L35 74 L25 42 Z' fill='none' stroke='%23f59e0b' stroke-width='6' stroke-linejoin='round'/><circle cx='50' cy='50' r='10' fill='%233b82f6'/></svg>";
    
    const visaMcIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%231f242d'/><circle cx='38' cy='50' r='22' fill='%23eb001b' fill-opacity='0.9'/><circle cx='62' cy='50' r='22' fill='%23f79e1b' fill-opacity='0.85'/></svg>";

    const currenciesData = [
        // === ФИАТ ===
        { code: 'RUB', name: 'Сбербанк', category: 'fiat', icon: sberIcon, networks: [{ net: 'RUB', rateUSD: 0.011 }] },
        { code: 'RUB', name: 'Т-Банк', category: 'fiat', icon: tbankIcon, networks: [{ net: 'RUB', rateUSD: 0.011 }] },
        { code: 'RUB', name: 'Альфа-Банк', category: 'fiat', icon: alfaIcon, networks: [{ net: 'RUB', rateUSD: 0.011 }] },
        { code: 'RUB', name: 'СБП', category: 'fiat', icon: sbpIcon, networks: [{ net: 'RUB', rateUSD: 0.011 }] },
        { code: 'RUB', name: 'Visa / Mastercard', category: 'fiat', icon: visaMcIcon, networks: [{ net: 'RUB', rateUSD: 0.011 }] },
        
        // === СТЕЙБЛКОИНЫ ===
        { code: 'USDT', name: 'Tether USDT', category: 'stable', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=032', networks: [{ net: 'TRC-20', rateUSD: 1 }, { net: 'ERC-20', rateUSD: 1 }] },
        { code: 'USDC', name: 'USD Coin', category: 'stable', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=032', networks: [{ net: 'ERC-20', rateUSD: 1 }] },
        
        // === КРИПТО ===
        { code: 'BTC', name: 'Bitcoin', category: 'crypto', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032', networks: [{ net: 'Bitcoin Native', rateUSD: 95000 }, { net: 'BEP-20', rateUSD: 95000 }] },
        { code: 'ETH', name: 'Ethereum', category: 'crypto', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032', networks: [{ net: 'ERC-20', rateUSD: 2700 }] },
        { code: 'SOL', name: 'Solana', category: 'crypto', icon: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032', networks: [{ net: 'Solana', rateUSD: 180 }] },
        { code: 'BNB', name: 'BNB', category: 'crypto', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=032', networks: [{ net: 'BEP-20', rateUSD: 600 }] },
        { code: 'TON', name: 'Toncoin', category: 'crypto', icon: 'https://cryptologos.cc/logos/toncoin-ton-logo.svg?v=032', networks: [{ net: 'TON', rateUSD: 5.5 }] },
        { code: 'TRX', name: 'TRON', category: 'crypto', icon: 'https://cryptologos.cc/logos/tron-trx-logo.svg?v=032', networks: [{ net: 'TRC-20', rateUSD: 0.25 }] },
        { code: 'DOT', name: 'Polkadot', category: 'crypto', icon: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.svg?v=032', networks: [{ net: 'Polkadot', rateUSD: 7.5 }] },
        { code: 'XRP', name: 'XRP', category: 'crypto', icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032', networks: [{ net: 'Ripple', rateUSD: 2.2 }] },
        { code: 'DOGE', name: 'Dogecoin', category: 'crypto', icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=032', networks: [{ net: 'Dogecoin', rateUSD: 0.25 }] },
        { code: 'ADA', name: 'Cardano', category: 'crypto', icon: 'https://cryptologos.cc/logos/cardano-ada-logo.svg?v=032', networks: [{ net: 'Cardano', rateUSD: 0.8 }] },
        { code: 'AVAX', name: 'Avalanche', category: 'crypto', icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=032', networks: [{ net: 'C-Chain', rateUSD: 28 }] },
        { code: 'LINK', name: 'Chainlink', category: 'crypto', icon: 'https://cryptologos.cc/logos/chainlink-link-logo.svg?v=032', networks: [{ net: 'ERC-20', rateUSD: 18 }] },
        { code: 'XMR', name: 'Monero', category: 'crypto', icon: 'https://cryptologos.cc/logos/monero-xmr-logo.svg?v=032', networks: [{ net: 'Monero', rateUSD: 160 }] },
        { code: 'BCH', name: 'Bitcoin Cash', category: 'crypto', icon: 'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.svg?v=032', networks: [{ net: 'Bitcoin Cash', rateUSD: 300 }] },
        { code: 'ETC', name: 'Ethereum Classic', category: 'crypto', icon: 'https://cryptologos.cc/logos/ethereum-classic-etc-logo.svg?v=032', networks: [{ net: 'Ethereum Classic', rateUSD: 25 }] },
        { code: 'LTC', name: 'Litecoin', category: 'crypto', icon: 'https://cryptologos.cc/logos/litecoin-ltc-logo.svg?v=032', networks: [{ net: 'Litecoin', rateUSD: 85 }] },
        { code: 'ZEC', name: 'Zcash', category: 'crypto', icon: 'https://cryptologos.cc/logos/zcash-zec-logo.svg?v=032', networks: [{ net: 'Zcash', rateUSD: 30 }] }
    ];

    let selectedFrom = { coin: null, net: null, rate: 0 };
    let selectedTo = { coin: null, net: null, rate: 0 };
    let livePrices = {};
    let pollingInterval = null;
    let currentUser = null;
    let currentRegisterEmail = '';

    // === УПРАВЛЕНИЕ ВЫПАДАЮЩИМ МЕНЮ ПРОФИЛЯ ===
    function toggleUserDropdown(e) {
        if (e) e.stopPropagation();
        const menu = document.getElementById('userDropdownMenu');
        menu.classList.toggle('active');
    }

    window.addEventListener('click', () => {
        const menu = document.getElementById('userDropdownMenu');
        if (menu && menu.classList.contains('active')) {
            menu.classList.remove('active');
        }
    });

    // === ДИНАМИЧЕСКИЙ ГЕНЕРАТОР АКТИВНОСТИ (8-15 сек, разные статусы и тайминги) ===
    const popularCoins = ['BTC', 'USDT', 'SOL', 'BNB', 'TRX', 'DOT', 'ETH', 'TON', 'RUB'];
    const statusesList = [
        { name: 'Completed', class: 'completed' },
        { name: 'Moderation', class: 'moderation' },
        { name: 'Cancelled', class: 'cancelled' }
    ];
    // Взвешенный выбор статуса: 70% Completed, 20% Moderation, 10% Cancelled
    function getWeightedStatus() {
        const r = Math.random();
        if (r < 0.70) return statusesList[0];
        if (r < 0.90) return statusesList[1];
        return statusesList[2];
    }
    const timingMapRu = ['только что', 'пару секунд назад', '15 секунд назад', '30 секунд назад', '1 мин назад', '2 мин назад', '3 мин назад', '5 мин назад', '8 мин назад', '10 мин назад', '12 мин назад', '15 мин назад'];
    const timingMapEn = ['just now', 'a few seconds ago', '15 seconds ago', '30 seconds ago', '1 min ago', '2 min ago', '3 min ago', '5 min ago', '8 min ago', '10 min ago', '12 min ago', '15 min ago'];
    const statusMapRu = { 'completed': 'Выполнен', 'moderation': 'В обработке', 'cancelled': 'Отменен' };
    const statusMapEn = { 'completed': 'Completed', 'moderation': 'Moderation', 'cancelled': 'Cancelled' };

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    
    function renderActivityTable(trades) {
        const tbody = document.getElementById('activity-tbody');
        if (!tbody) return;
        
        const existingCount = tbody.children.length;
        tbody.innerHTML = '';
        
        trades.forEach((trade, idx) => {
            const statClass = trade.status || 'completed';
            const statTitle = currentLang === 'en' ? (statusMapEn[statClass] || statClass) : (statusMapRu[statClass] || statClass);
            
            let timingText = '';
            const diffMs = Date.now() - trade.time;
            const diffMin = Math.floor(diffMs / 60000);
            if (diffMin < 1) {
                timingText = currentLang === 'en' ? 'just now' : 'только что';
            } else {
                timingText = currentLang === 'en' ? diffMin + ' min ago' : diffMin + ' мин назад';
            }

            const tr = document.createElement('tr');
            if (idx === 0 && existingCount > 0) {
                tr.style.animation = "flashGreen 1s ease-out";
            }
            
            let directionHTML = '<b>' + (trade.direction || '') + '</b>';
            let amountHTML = trade.amount ? trade.amount.toLocaleString('ru-RU') + ' RUB' : '0';
            
            tr.innerHTML = 
                '<td>' + directionHTML + '</td>' +
                '<td>' + amountHTML + '</td>' +
                '<td><span class="status-badge ' + statClass + '" data-stat-class="' + statClass + '">' + statTitle + '</span></td>' +
                '<td style="color: var(--text-muted);">' + timingText + '</td>';
                
            tbody.appendChild(tr);
        });
    }

    async function fetchActivity() {
        try {
            const res = await fetch('/api/activity');
            if (res.ok) {
                const trades = await res.json();
                renderActivityTable(trades);
            }
        } catch (e) {
            console.error('Failed to fetch activity', e);
        }
    }


    // ==================== ЛОГИКА ФИЛЬТРАЦИИ ВКЛАДОК ====================
    function filterTree(type, category, tabElement) {
        const tabs = tabElement.parentElement.querySelectorAll('.asset-tab');
        tabs.forEach(t => t.classList.remove('active'));
        tabElement.classList.add('active');
        // Track active category so polling doesn't reset user's tab selection
        if (type === 'from') activeFromCategory = category;
        else activeToCategory = category;
        buildCurrencyTree(`${type}-tree`, type, category);
    }

    function buildCurrencyTree(containerId, type, filterCategory = 'fiat') {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        const filteredData = currenciesData.filter(coin => coin.category === filterCategory && !disabledCurrenciesList.includes(coin.code));

        filteredData.forEach((coin) => {
            const node = document.createElement('div');
            node.className = 'coin-node';
            
            const isFiat = coin.category === 'fiat';
            const badgeHtml = isFiat ? '' : `<span class="net-count-badge">${coin.networks.length}</span><span class="arrow-toggle">▼</span>`;

            node.innerHTML = `
                <div class="coin-header">
                    <div class="coin-left">
                        <img src="${coin.icon}" class="coin-icon" onerror="this.src='https://cdn-icons-png.flaticon.com/512/2850/2850316.png'">
                        <div><div class="coin-symbol">${coin.name}</div><div class="coin-sub">${coin.code}</div></div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        ${badgeHtml}
                    </div>
                </div>
                <div class="networks-list">
                    ${coin.networks.map(n => `<div class="net-item" data-net="${n.net}">${coin.code} (${n.net})</div>`).join('')}
                </div>
            `;
            
            const header = node.querySelector('.coin-header');
            header.onclick = () => {
                if (isFiat) {
                    const firstNet = node.querySelector('.net-item');
                    if (firstNet) firstNet.click();
                } else {
                    const wasExpanded = node.classList.contains('expanded');
                    Array.from(container.children).forEach(c => c.classList.remove('expanded'));
                    if (!wasExpanded) {
                        node.classList.add('expanded');
                        const firstNet = node.querySelector('.net-item');
                        if (firstNet) firstNet.click();
                    }
                }
            };

            node.querySelectorAll('.net-item').forEach((item, index) => {
                item.onclick = (e) => {
                    e.stopPropagation();
                    container.querySelectorAll('.net-item').forEach(i => i.classList.remove('selected'));
                    // Убираем подсветку со всех нод и добавляем только активной
                    container.querySelectorAll('.coin-node').forEach(n => n.classList.remove('active-node'));
                    item.classList.add('selected');
                    node.classList.add('active-node');
                    
                    const displayName = isFiat ? coin.name : `${coin.code} (${item.getAttribute('data-net')})`;
                    selectActiveAsset(type, coin, displayName, coin.networks[index].rateUSD);
                    if (e && e.isTrusted && window.innerWidth <= 768) {
                        if (typeof selectedFrom !== 'undefined' && selectedFrom.coin && typeof selectedTo !== 'undefined' && selectedTo.coin) {
                            setTimeout(() => {
                                const targetCard = document.querySelector('.exchange-grid .exchange-card:nth-child(3)');
                                if (targetCard) targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 150);
                        }
                    }

                };
            });
            container.appendChild(node);
        });
    }

    function selectActiveAsset(type, coin, displayName, rate) {
        document.getElementById(`${type}-pill-text`).innerText = displayName;
        const img = document.getElementById(`${type}-pill-img`);
        img.src = coin.icon; 
        img.style.display = 'block';
        if (type === 'from') selectedFrom = { coin, net: displayName, rate };
        else selectedTo = { coin, net: displayName, rate };
        recalculate();
    }

    // ==================== АВТОРИЗАЦИЯ И ОТЗЫВЫ ====================


    async function checkCurrentAuth() {
        try {
            const res = await fetch('/api/auth/me', { headers: getAuthHeaders(), credentials: 'same-origin' });
            const data = await res.json();
            if (data.authenticated && data.user) renderUser(data.user);
            else renderGuest();
        } catch (err) {
            renderGuest();
        }
    }

    async function loginWithTelegram() {
        const btn = document.getElementById('tg-login-btn');
        const statusBox = document.getElementById('status-box');

        if (btn) btn.disabled = true;
        if (statusBox) {
            statusBox.style.display = 'block';
            statusBox.className = 'status-box pending';
            statusBox.innerHTML = '<span class="spinner"></span> ' + (currentLang === 'en' ? 'Opening Telegram...' : 'Переход в Telegram...');
        }

        try {
            const res = await fetch('/api/auth/telegram/init');
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Ошибка генерации ссылки');
            window.open(data.deepLink, '_blank');

            if (statusBox) statusBox.innerHTML = '<span class="spinner"></span> ' + (currentLang === 'en' ? 'Waiting for confirmation in Telegram...' : 'Ожидание подтверждения в Telegram...');
            if (pollingInterval) clearInterval(pollingInterval);

            // Hard 10-minute timeout to match server-side session TTL
            const pollDeadline = Date.now() + 10 * 60 * 1000;

            pollingInterval = setInterval(async () => {
                // Stop polling if deadline exceeded
                if (Date.now() > pollDeadline) {
                    clearInterval(pollingInterval);
                    if (btn) btn.disabled = false;
                    if (statusBox) {
                        statusBox.className = 'status-box error';
                        statusBox.textContent = currentLang === 'en' ? 'Session expired. Please try again.' : 'Сессия истекла. Попробуйте снова.';
                    }
                    return;
                }
                try {
                    const checkRes = await fetch(`/api/auth/telegram/check/${data.code}`);
                    const checkData = await checkRes.json();
                    if (checkData.authenticated) {
                        clearInterval(pollingInterval);
                        if (statusBox) statusBox.style.display = 'none';
                        if (checkData.token) localStorage.setItem('token', checkData.token);
                        renderUser(checkData.user);
                        closeAuthModal();
                    } else if (checkData.expired) {
                        // Server says token is gone - stop polling silently
                        clearInterval(pollingInterval);
                        if (btn) btn.disabled = false;
                        if (statusBox) {
                            statusBox.className = 'status-box error';
                            statusBox.textContent = currentLang === 'en' ? 'Session expired. Please try again.' : 'Сессия истекла. Попробуйте снова.';
                        }
                    }
                } catch (e) {}
            }, 2000);
        } catch (err) {
            if (btn) btn.disabled = false;
            if (statusBox) {
                statusBox.className = 'status-box error';
                statusBox.textContent = err.message || (currentLang === 'en' ? 'Telegram auth error' : 'Ошибка запуска авторизации');
            }
        }
    }

    async function logout() {
        try {
            await fetch('/api/auth/logout', { credentials: 'same-origin', method: 'POST', headers: getAuthHeaders() });
            localStorage.removeItem('token');
            if (pollingInterval) clearInterval(pollingInterval);
            renderGuest();
        } catch (err) {}
    }

    function renderUser(user) {
        currentUser = user;
        const headerBtn = document.getElementById('header-auth-btn');
        const nameStr = user.display_name || user.email || 'Профиль';
        if (headerBtn) {
            headerBtn.innerHTML = '<img src="https://ui-avatars.com/api/?name=' + encodeURIComponent(nameStr) + '&background=f59e0b&color=000" style="width:20px;height:20px;border-radius:50%;margin-right:8px;vertical-align:middle;">' + nameStr;
            headerBtn.classList.add('avatar-btn');
        }

        
        document.getElementById('ud-guest-content').style.display = 'none';
        document.getElementById('ud-auth-content').style.display = 'block';
        document.getElementById('ud-user-name').textContent = nameStr;
        document.getElementById('ud-user-id').textContent = user.id || '10492';
        document.getElementById('ud-user-initial').textContent = nameStr.charAt(0).toUpperCase();
        document.getElementById('reviewAuthWarning').style.display = 'none';

        const balDisplay = document.getElementById('header-balance-display');
        if (balDisplay) balDisplay.style.display = 'flex';
        const balRub = document.getElementById('header-balance-rub');
        if (balRub) balRub.textContent = parseFloat(user.balance_rub || 0).toFixed(2);
        const modalBalRub = document.getElementById('modal-balance-rub');
        if (modalBalRub) modalBalRub.textContent = parseFloat(user.balance_rub || 0).toFixed(2);

        
        
        if (user.wallet_address) {
            sessionStorage.setItem('web3_signed_address', user.wallet_address);
            const btnWeb3 = document.getElementById('btn-connect-web3');
            const btnDisconnect = document.getElementById('btn-disconnect-web3');
            if (btnWeb3) btnWeb3.innerText = 'Подключено: ' + user.wallet_address.slice(0, 6) + '...' + user.wallet_address.slice(-4);
            if (btnDisconnect) btnDisconnect.style.display = 'block';
        } else {
            sessionStorage.removeItem('web3_signed_address');
            const btnWeb3 = document.getElementById('btn-connect-web3');
            const btnDisconnect = document.getElementById('btn-disconnect-web3');
            if (btnWeb3) btnWeb3.innerText = 'ПОДКЛЮЧИТЬ WEB3 КОШЕЛЕК';
            if (btnDisconnect) btnDisconnect.style.display = 'none';
        }
        
        // Chat Protection

        const chatOverlay = document.getElementById('chatAuthOverlay');
        if (chatOverlay) chatOverlay.style.display = 'none';
        const chatInput = document.getElementById('chatInputContainer');
        if (chatInput) chatInput.style.pointerEvents = 'auto';
        if (chatInput) chatInput.style.opacity = '1';

        // Re-sync WS if needed
        if (typeof socket !== 'undefined' && socket && socket.connected) {
            socket.disconnect();
            setTimeout(() => socket.connect(), 200);
        }
    }

    function renderGuest() {
        currentUser = null;
        const headerBtn = document.getElementById('header-auth-btn');
        if (headerBtn) {
            headerBtn.innerHTML = currentLang === 'en' ? 'Log In' : 'Войти';
            headerBtn.classList.remove('avatar-btn');
        }

        
        document.getElementById('ud-guest-content').style.display = 'block';
        document.getElementById('ud-auth-content').style.display = 'none';
        document.getElementById('reviewAuthWarning').style.display = 'none';

        const balDisplay = document.getElementById('header-balance-display');
        if (balDisplay) balDisplay.style.display = 'none';


        
        sessionStorage.removeItem('web3_signed_address');
        const btnWeb3 = document.getElementById('btn-connect-web3');
        const btnDisconnect = document.getElementById('btn-disconnect-web3');
        if (btnWeb3) btnWeb3.innerText = 'ПОДКЛЮЧИТЬ WEB3 КОШЕЛЕК';
        if (btnDisconnect) btnDisconnect.style.display = 'none';

        // Block Chat

        const chatOverlay = document.getElementById('chatAuthOverlay');
        if (chatOverlay) chatOverlay.style.display = 'block';
        const chatInput = document.getElementById('chatInputContainer');
        if (chatInput) chatInput.style.pointerEvents = 'none';
        if (chatInput) chatInput.style.opacity = '0.3';

        // Re-sync WS
        if (typeof socket !== 'undefined' && socket && socket.connected) {
            socket.disconnect();
            setTimeout(() => socket.connect(), 200);
        }
    }

    let modalReviewsCurrentPage = 1;
    let modalReviewsTotalPages = 10;

    function openReviewsModal() {
        document.getElementById('reviewsModal').classList.add('active');
        loadModalReviews(1);
    }
    function closeReviewsModal() {
        document.getElementById('reviewsModal').classList.remove('active');
    }

    async function loadReviewsPreview() {
        const container = document.getElementById('reviews-widget-container');
        if (!container) return;
        try {
            const res = await fetch('/api/reviews/preview');
            if (res.ok) {
                const data = await res.json();
                if (data.reviews && data.reviews.length > 0) {
                    container.innerHTML = data.reviews.slice(0, 3).map((r, idx) => `
                        <div class="review-card ${idx % 2 === 0 ? 'formal' : 'short'}">
                            <div class="review-author">
                                <b title="${escapeHtml(r.author || '')}">${escapeHtml(r.author || 'Пользователь')}</b>
                                <span>${formatReviewDate(r.created_at)}</span>
                            </div>
                            <div class="review-text">${escapeHtml(r.text || '')}</div>
                        </div>
                    `).join('');
                    return;
                }
            }
        } catch (e) {
            console.error('Reviews preview load error:', e);
        }
    }

    async function loadModalReviews(page) {
        modalReviewsCurrentPage = page;
        const list = document.getElementById('allReviewsList');
        if (!list) return;

        list.innerHTML = '<div style="text-align:center; padding:40px 20px; color:var(--text-muted); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px;"><div class="spinner"></div><span style="font-size:12px;">' + (currentLang === 'en' ? 'Loading reviews...' : 'Загрузка отзывов...') + '</span></div>';

        try {
            const res = await fetch(`/api/reviews?page=${page}&limit=4`);
            if (res.ok) {
                const data = await res.json();
                modalReviewsTotalPages = Math.max(1, data.totalPages || 1);
                
                list.className = 'fade-in';
                if (data.reviews && data.reviews.length > 0) {
                    list.innerHTML = data.reviews.map((r, idx) => `
                        <div class="review-card ${idx % 2 === 0 ? 'formal' : 'short'}">
                            <div class="review-author">
                                <b title="${escapeHtml(r.author || '')}">${escapeHtml(r.author || 'Пользователь')}</b>
                                <span>${formatReviewDate(r.created_at)}</span>
                            </div>
                            <div class="review-text">${escapeHtml(r.text || '')}</div>
                        </div>
                    `).join('');
                } else {
                    list.innerHTML = `<div style="text-align:center; padding:40px 20px; color:var(--text-muted); font-size:13px;">${currentLang === 'en' ? 'No reviews found' : 'Отзывов пока нет'}</div>`;
                }

                // Update counter and buttons
                const counter = document.getElementById('rev-modal-counter');
                if (counter) {
                    counter.innerText = currentLang === 'en'
                        ? `Page ${page} of ${modalReviewsTotalPages}`
                        : `Страница ${page} из ${modalReviewsTotalPages}`;
                }

                const prevBtn = document.getElementById('rev-modal-prev');
                const nextBtn = document.getElementById('rev-modal-next');
                if (prevBtn) {
                    prevBtn.disabled = page <= 1;
                    prevBtn.style.opacity = page <= 1 ? '0.5' : '1';
                    prevBtn.style.cursor = page <= 1 ? 'not-allowed' : 'pointer';
                }
                if (nextBtn) {
                    nextBtn.disabled = page >= modalReviewsTotalPages;
                    nextBtn.style.opacity = page >= modalReviewsTotalPages ? '0.5' : '1';
                    nextBtn.style.cursor = page >= modalReviewsTotalPages ? 'not-allowed' : 'pointer';
                }
            }
        } catch (e) {
            list.innerHTML = `<div style="text-align:center; padding:20px; color:var(--red);">${currentLang === 'en' ? 'Error loading reviews' : 'Ошибка загрузки отзывов'}</div>`;
        }
    }



    function toggleFaq(btn) {
        if (!btn) return;
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('.icon');
        if (!content) return;
        
        // Check if it's currently expanded (has a pixel value)
        if (content.style.maxHeight && content.style.maxHeight !== '0px' && content.style.maxHeight !== '0') {
            content.style.maxHeight = '0px';
            if (icon) icon.textContent = '+';
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            if (icon) icon.textContent = '−';
        }
    }

    function prevModalReviews() {
        if (typeof modalReviewsCurrentPage !== 'undefined' && modalReviewsCurrentPage > 1) {
            loadModalReviews(modalReviewsCurrentPage - 1);
        }
    }

    function nextModalReviews() {
        if (typeof modalReviewsCurrentPage !== 'undefined' && typeof modalReviewsTotalPages !== 'undefined' && modalReviewsCurrentPage < modalReviewsTotalPages) {
            loadModalReviews(modalReviewsCurrentPage + 1);
        }
    }

    function formatReviewDate(dateStr) {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const year = d.getFullYear();
            return `${day}.${month}.${year}`;
        } catch (e) {
            return dateStr;
        }
    }

    async function submitReview() {
        if (!currentUser) {
            document.getElementById('reviewAuthWarning').style.display = 'block';
            return;
        }
        const text = document.getElementById('newReviewText').value.trim();
        if (!text) {
            showToast(currentLang === 'en' ? 'Please write your review text!' : 'Пожалуйста, напишите текст отзыва!', 'error');
            return;
        }

        const submitBtn = document.getElementById('btn-submit-review');
        const submitText = document.getElementById('btn-submit-review-text');
        const originalText = submitText ? submitText.textContent : 'Отправить отзыв';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            if (submitText) {
                submitText.innerHTML = '<span class="spinner" style="display:inline-block; width:14px; height:14px; border:2px solid rgba(0,0,0,0.2); border-top-color:#12141a; border-radius:50%; animation:spin 0.8s linear infinite; vertical-align:middle; margin-right:6px;"></span> ' + (currentLang === 'en' ? 'Submitting...' : 'Отправка...');
            }
        }

        const userName = currentUser.display_name || currentUser.email || 'Пользователь';
        try {
            const res = await fetch('/api/reviews', { credentials: 'same-origin',
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({ author: userName, text })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                document.getElementById('newReviewText').value = '';
                showToast(currentLang === 'en' ? 'Review successfully submitted!' : 'Отзыв успешно отправлен!', 'success');
                loadReviewsPreview();
                if (document.getElementById('reviewsModal').classList.contains('active')) {
                    loadModalReviews(1);
                }
            } else {
                showToast(data.error || (currentLang === 'en' ? 'Error submitting review' : 'Ошибка при отправке отзыва'), 'error');
            }
        } catch (e) {
            console.error(e);
            showToast(currentLang === 'en' ? 'Server connection error' : 'Ошибка соединения с сервером', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                if (submitText) {
                    submitText.textContent = originalText;
                }
            }
        }
    }

    let systemMarginPercent = 1.5;
    let disabledCurrenciesList = [];
    let activeFromCategory = 'fiat';
    let activeToCategory = 'crypto';
    let settingsLoaded = false;

    async function fetchSystemSettings() {
        try {
            const res = await fetch('/api/settings', { credentials: 'same-origin' });
            if (res.ok) {
                const data = await res.json();
                if (data.margin !== undefined) systemMarginPercent = data.margin;
                if (data.disabled_currencies && Array.isArray(data.disabled_currencies)) {
                    disabledCurrenciesList = data.disabled_currencies;
                    // Only rebuild trees on first load; afterwards the user controls the active tab
                    if (!settingsLoaded) {
                        settingsLoaded = true;
                        buildCurrencyTree('from-tree', 'from', activeFromCategory);
                        buildCurrencyTree('to-tree', 'to', activeToCategory);
                    }
                }
            }
        } catch (e) {}
    }

    async function fetchBinanceRates() {
        try {
            await fetchSystemSettings();
            const res = await fetch('https://api.binance.com/api/v3/ticker/price');
            const data = await res.json();
            data.forEach(item => {
                if (item.symbol.endsWith('USDT')) {
                    const coin = item.symbol.replace('USDT', '');
                    livePrices[coin] = parseFloat(item.price);
                }
                if (item.symbol === 'USDTRUB') {
                    livePrices['RUB'] = 1 / parseFloat(item.price);
                }
            });
            livePrices['USDT'] = 1;
            if (!livePrices['RUB']) livePrices['RUB'] = 0.011;
            updateSystemRates();
            renderTicker();
            recalculate();
        } catch (error) {}
    }

        function updateSystemRates() {
        currenciesData.forEach(c => {
            if (c.code !== 'RUB' && c.code !== 'USDT' && livePrices[c.code]) {
                c.networks.forEach(n => n.rateUSD = livePrices[c.code]);
            }
        });
        if (selectedFrom.coin && livePrices[selectedFrom.coin.code]) {
            selectedFrom.rate = livePrices[selectedFrom.coin.code];
        } else if (selectedFrom.coin && selectedFrom.coin.code === 'RUB') {
            selectedFrom.rate = 0.011;
        } else if (selectedFrom.coin && selectedFrom.coin.code === 'USDT') {
            selectedFrom.rate = 1;
        }
        
        if (selectedTo.coin && livePrices[selectedTo.coin.code]) {
            selectedTo.rate = livePrices[selectedTo.coin.code];
        } else if (selectedTo.coin && selectedTo.coin.code === 'RUB') {
            selectedTo.rate = 0.011;
        } else if (selectedTo.coin && selectedTo.coin.code === 'USDT') {
            selectedTo.rate = 1;
        }
    }


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
                    html += `<div class="ticker-item" data-coin="${coin}">
                                <img src="${iconUrl}"> 
                                <b>${coin}</b> 
                                <span class="ticker-price">...</span>
                             </div>`;
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

        function recalculate() {
        if (!selectedFrom.coin || !selectedTo.coin || !selectedFrom.rate || !selectedTo.rate) return;
        const rawGive = (document.getElementById('amount-give').value || '').toString().replace(',', '.').trim();
        const giveVal = parseFloat(rawGive) || 0;
        
        const totalUSD = giveVal * selectedFrom.rate;
        let resultVal = totalUSD / selectedTo.rate;
        
        // APPLY MARGIN IN BOTH DIRECTIONS (User always receives less)
        resultVal = resultVal * (1 - systemMarginPercent / 100);
        
        document.getElementById('amount-get').value = resultVal < 1 ? resultVal.toFixed(6) : resultVal.toFixed(2);
        
        const crossRate = (selectedFrom.rate / selectedTo.rate) * (1 - systemMarginPercent / 100);
        document.getElementById('summary-rate').innerText = `1 ${selectedFrom.coin.code} ≈ ${crossRate < 1 ? crossRate.toFixed(6) : crossRate.toFixed(2)} ${selectedTo.coin.code}`;
    }


    async function submitLoginEmail() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const errBox = document.getElementById('login-error');
        errBox.style.display = 'none';

        if (!email || !password) { errBox.innerText = 'Введите email и пароль'; errBox.style.display = 'block'; return; }
        
        document.getElementById('btn-submit-login').innerHTML = '<span class="spinner"></span> Вход...';
        document.getElementById('btn-submit-login').disabled = true;

        try {
            const res = await fetch('/api/auth/email/login', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                if (data.token) localStorage.setItem('token', data.token);
                renderUser(data.user);
                closeAuthModal();
            } else {
                throw new Error(data.error || 'Ошибка входа');
            }
        } catch (e) {
            errBox.innerText = e.message;
            errBox.style.display = 'block';
        }
        document.getElementById('btn-submit-login').innerText = 'Войти';
        document.getElementById('btn-submit-login').disabled = false;
    }

    let pendingRegisterEmail = '';
    async function submitRegisterInit() {
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const passwordConfirm = document.getElementById('reg-password-confirm').value;
        const errBox = document.getElementById('reg-error');
        errBox.style.display = 'none';

        if (!email || !password || !passwordConfirm) { errBox.innerText = 'Заполните все поля'; errBox.style.display = 'block'; return; }
        if (password !== passwordConfirm) { errBox.innerText = 'Пароли не совпадают'; errBox.style.display = 'block'; return; }
        if (password.length < 6) { errBox.innerText = 'Пароль должен быть минимум 6 символов'; errBox.style.display = 'block'; return; }

        document.getElementById('btn-submit-reg').innerHTML = '<span class="spinner"></span> Отправка кода...';
        document.getElementById('btn-submit-reg').disabled = true;

        try {
            const res = await fetch('/api/auth/email/register-init', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                pendingRegisterEmail = email;
                document.getElementById('reg-step-1').style.display = 'none';
                document.getElementById('reg-step-2').style.display = 'block';
            } else {
                throw new Error(data.error || 'Ошибка регистрации');
            }
        } catch (e) {
            errBox.innerText = e.message;
            errBox.style.display = 'block';
        }
        document.getElementById('btn-submit-reg').innerText = 'Зарегистрироваться';
        document.getElementById('btn-submit-reg').disabled = false;
    }

    async function submitRegisterConfirm() {
        const code = document.getElementById('reg-code').value.trim();
        const errBox = document.getElementById('reg-confirm-error');
        errBox.style.display = 'none';
        
        if (!code) { errBox.innerText = 'Введите код подтверждения'; errBox.style.display = 'block'; return; }

        document.getElementById('btn-submit-reg-confirm').innerHTML = '<span class="spinner"></span> Подтверждение...';
        document.getElementById('btn-submit-reg-confirm').disabled = true;

        try {
            const res = await fetch('/api/auth/email/register-confirm', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: pendingRegisterEmail, code })
            });
            const data = await res.json();
            if (data.success) {
                if (data.token) localStorage.setItem('token', data.token);
                renderUser(data.user);
                closeAuthModal();
            } else {
                throw new Error(data.error || 'Неверный код');
            }
        } catch (e) {
            errBox.innerText = e.message;
            errBox.style.display = 'block';
        }
        document.getElementById('btn-submit-reg-confirm').innerText = 'Подтвердить';
        document.getElementById('btn-submit-reg-confirm').disabled = false;
    }

    let pendingForgotEmail = '';
    async function submitForgotInit() {
        const email = document.getElementById('forgot-email').value.trim();
        const errBox = document.getElementById('forgot-error');
        errBox.style.display = 'none';

        if (!email) { errBox.innerText = 'Введите email'; errBox.style.display = 'block'; return; }

        document.getElementById('btn-submit-forgot').innerHTML = '<span class="spinner"></span> Отправка...';
        document.getElementById('btn-submit-forgot').disabled = true;

        try {
            const res = await fetch('/api/auth/email/forgot-init', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.success) {
                pendingForgotEmail = email;
                document.getElementById('forgot-step-1').style.display = 'none';
                document.getElementById('forgot-step-2').style.display = 'block';
            } else {
                throw new Error(data.error || 'Ошибка восстановления');
            }
        } catch (e) {
            errBox.innerText = e.message;
            errBox.style.display = 'block';
        }
        document.getElementById('btn-submit-forgot').innerText = 'Отправить код';
        document.getElementById('btn-submit-forgot').disabled = false;
    }

    async function submitForgotConfirm() {
        const code = document.getElementById('forgot-code').value.trim();
        const newPassword = document.getElementById('forgot-new-password').value;
        const errBox = document.getElementById('forgot-confirm-error');
        errBox.style.display = 'none';

        if (!code || !newPassword) { errBox.innerText = 'Заполните все поля'; errBox.style.display = 'block'; return; }
        if (newPassword.length < 6) { errBox.innerText = 'Пароль должен быть минимум 6 символов'; errBox.style.display = 'block'; return; }

        document.getElementById('btn-submit-forgot-confirm').innerHTML = '<span class="spinner"></span> Сохранение...';
        document.getElementById('btn-submit-forgot-confirm').disabled = true;

        try {
            const res = await fetch('/api/auth/email/forgot-confirm', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: pendingForgotEmail, code, newPassword })
            });
            const data = await res.json();
            if (data.success) {
                if (data.token) localStorage.setItem('token', data.token);
                renderUser(data.user);
                closeAuthModal();
            } else {
                throw new Error(data.error || 'Ошибка подтверждения');
            }
        } catch (e) {
            errBox.innerText = e.message;
            errBox.style.display = 'block';
        }
        document.getElementById('btn-submit-forgot-confirm').innerText = 'Сохранить пароль и войти';
        document.getElementById('btn-submit-forgot-confirm').disabled = false;
    }

    function openAuthModal(view) {
        document.getElementById('authModal').classList.add('active');
        document.querySelectorAll('.auth-view').forEach(el => el.style.display = 'none');
        document.getElementById(`form-${view}`).style.display = 'block';
        if (view === 'register') {
            document.getElementById('reg-step-1').style.display = 'block';
            document.getElementById('reg-step-2').style.display = 'none';
        }
        if (view === 'forgot') {
            document.getElementById('forgot-step-1').style.display = 'block';
            document.getElementById('forgot-step-2').style.display = 'none';
        }
    }

    function closeAuthModal() { 
        document.getElementById('authModal').classList.remove('active');
        if (pollingInterval) clearInterval(pollingInterval);
    }



    function getAuthHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('token');
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    }

    let currentActiveOrderId = null;
    let orderTimerInterval = null;
    let chatPollInterval = null;

    async function validateWalletAddress(wallet, currencyCode) {
        wallet = wallet.replace(/\s+/g, '');
        currencyCode = currencyCode.toUpperCase();
        
        try {
            const r = await fetch('/api/validate-wallet', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ address: wallet, coin: currencyCode })
            });
            const data = await r.json();
            return data.valid;
        } catch(e) {
            return true; // Fallback to allow if API fails
        }
    }

    async function createOrder() {
        const rawGive = (document.getElementById('amount-give').value || '').toString().replace(',', '.').trim();
        const rawGet = (document.getElementById('amount-get').value || '').toString().replace(',', '.').trim();
        const amountGive = parseFloat(rawGive);
        const amountGet = parseFloat(rawGet);
        const userWallet = document.getElementById('user-wallet').value.trim();
        const errDiv = document.getElementById('wallet-error');
        errDiv.style.display = 'none';

        if (!amountGive || isNaN(amountGive) || amountGive <= 0) {
            showToast(currentLang === 'en' ? 'Please specify an amount greater than 0' : 'Пожалуйста, укажите сумму отдачи больше 0', 'error');
            return;
        }
        if (!userWallet || userWallet.length < 4) {
            showToast(currentLang === 'en' ? 'Please enter your receiving wallet address or card number' : 'Пожалуйста, укажите ваш адрес кошелька или номер карты для получения', 'error');
            document.getElementById('user-wallet').focus();
            return;
        }

        const fromCoinCode = selectedFrom.coin ? (selectedFrom.coin.code || selectedFrom.coin) : 'RUB';
        const toCoinCode = selectedTo.coin ? (selectedTo.coin.code || selectedTo.coin) : 'BTC';
        
        if (!(await validateWalletAddress(userWallet, toCoinCode))) {
            const errText = currentLang === 'en' ? `Invalid format for ${toCoinCode}` : `Неверный формат реквизитов для ${toCoinCode}`;
            errDiv.innerText = errText;
            errDiv.style.display = 'block';
            showToast(errText, 'error');
            document.getElementById('user-wallet').focus();
            return;
        }

        const fromNet = selectedFrom.net || '';
        const toNet = selectedTo.net || '';

        const btn = document.getElementById('btn-create-order');
        btn.innerHTML = '<div class="spinner"></div> ' + (currentLang === 'en' ? 'Processing...' : 'Оформление...');
        btn.disabled = true;

        try {
            const res = await fetch('/api/orders', { credentials: 'same-origin',
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    from_currency: fromCoinCode,
                    to_currency: toCoinCode,
                    from_network: fromNet,
                    to_network: toNet,
                    amount_give: amountGive,
                    amount_get: amountGet,
                    user_wallet: userWallet
                })
            });
            const data = await res.json();
            if (res.ok && data.success && data.order) {
                showToast(currentLang === 'en' ? 'Order created successfully!' : 'Заявка успешно создана!', 'success');
                openOrderModal(data.order);
            } else {
                showToast(data.error || (currentLang === 'en' ? 'Order creation error' : 'Ошибка при создании заявки'), 'error');
            }
        } catch (err) {
            showToast(currentLang === 'en' ? 'Server connection error' : 'Ошибка соединения с сервером', 'error');
        } finally {
            btn.innerHTML = currentLang === 'en' ? 'Create Order ➔' : 'Создать заявку ➔';
            btn.disabled = false;
        }
    }

    function openOrderModal(order) {
        currentActiveOrderId = order.id;
        document.getElementById('orderModalTitle').innerText = (currentLang === 'en' ? `Order #` : `Заявка #`) + order.id;
        document.getElementById('orderModalAmountGive').innerText = `${order.amount_give} ${order.from_currency}`;
        document.getElementById('orderModalDirection').innerText = (currentLang === 'en' ? `You receive: ` : `Вы получаете: `) + `${order.amount_get} ${order.to_currency} ` + (currentLang === 'en' ? `to ` : `на `) + `${order.user_wallet}`;
        document.getElementById('orderModalDepositAddress').value = order.deposit_address || 'TYDzsYUEpvnYmQk4zGP9sWWcTEd36dAtW6';

        const statusBadge = document.getElementById('orderModalStatus');
        statusBadge.className = 'status-badge ' + (order.status === 'paid' ? 'paid' : (order.status === 'completed' ? 'completed' : (order.status === 'cancelled' ? 'cancelled' : 'new')));
        if (currentLang === 'en') {
            statusBadge.innerText = order.status === 'paid' ? 'Paid (verifying)' : (order.status === 'completed' ? 'Completed' : (order.status === 'cancelled' ? 'Cancelled' : 'Awaiting payment'));
        } else {
            statusBadge.innerText = order.status === 'paid' ? 'Оплачен (проверяется)' : (order.status === 'completed' ? 'Выполнен' : (order.status === 'cancelled' ? 'Отменена' : 'Ожидает оплаты'));
        }

        const isNew = order.status === 'new';
        const payBtn = document.getElementById('orderModalPayBtn');
        if (payBtn) payBtn.style.display = isNew ? 'block' : 'none';

        const cancelBtn = document.getElementById('orderModalCancelBtn');
        if (cancelBtn) cancelBtn.style.display = isNew ? 'block' : 'none';

        const timerBox = document.getElementById('orderModalTimerBox');
        if (timerBox) timerBox.style.display = isNew ? 'flex' : 'none';

        document.getElementById('orderModalMsg').style.display = 'none';

        if (isNew) {
            startOrderTimer(15 * 60);
        } else {
            if (orderTimerInterval) clearInterval(orderTimerInterval);
        }
        document.getElementById('orderModal').classList.add('active');
    }

    function closeOrderModal() {
        document.getElementById('orderModal').classList.remove('active');
        if (orderTimerInterval) clearInterval(orderTimerInterval);
    }

    function copyDepositAddress() {
        const addrInput = document.getElementById('orderModalDepositAddress');
        if (!addrInput || !addrInput.value) return;
        copyToClipboard(addrInput.value, currentLang === 'en' ? 'Deposit address copied!' : 'Реквизиты сервиса скопированы!');
    }

    function startOrderTimer(durationSeconds) {
        if (orderTimerInterval) clearInterval(orderTimerInterval);
        let remaining = durationSeconds;
        const timerEl = document.getElementById('orderModalTimer');

        orderTimerInterval = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                clearInterval(orderTimerInterval);
                timerEl.innerText = currentLang === 'en' ? 'Time expired' : 'Время истекло';
                return;
            }
            const m = Math.floor(remaining / 60);
            const s = remaining % 60;
            timerEl.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }, 1000);
    }

    async function confirmOrderPayment() {
        if (!currentActiveOrderId) return;
        const btn = document.getElementById('orderModalPayBtn');
        btn.innerHTML = '<div class="spinner"></div> ' + (currentLang === 'en' ? 'Confirming...' : 'Подтверждение...');
        btn.disabled = true;

        try {
            const res = await fetch(`/api/orders/${currentActiveOrderId}/pay`, {
                method: 'POST',
                headers: getAuthHeaders(),
                credentials: 'same-origin'
            });
            const data = await res.json();
            if (res.ok && data.success) {
                btn.style.display = 'none';
                const cancelBtn = document.getElementById('orderModalCancelBtn');
                if (cancelBtn) cancelBtn.style.display = 'none';
                const timerBox = document.getElementById('orderModalTimerBox');
                if (timerBox) timerBox.style.display = 'none';
                if (orderTimerInterval) clearInterval(orderTimerInterval);

                const statusBadge = document.getElementById('orderModalStatus');
                statusBadge.className = 'status-badge paid';
                statusBadge.innerText = currentLang === 'en' ? 'Paid (verifying)' : 'Оплачен (проверяется)';

                const msg = document.getElementById('orderModalMsg');
                msg.innerText = currentLang === 'en' ? '✅ Payment confirmed! Awaiting network confirmation.' : '✅ Оплата зафиксирована! Ожидайте подтверждения сети.';
                msg.style.display = 'block';
                showToast(currentLang === 'en' ? 'Payment marked as paid!' : 'Оплата зафиксирована!', 'success');
                if (typeof loadOrderHistory === 'function') loadOrderHistory();
            } else {
                showToast(data.error || (currentLang === 'en' ? 'Payment confirmation error' : 'Ошибка подтверждения оплаты'), 'error');
            }
        } catch (e) {
            showToast(currentLang === 'en' ? 'Server connection error' : 'Ошибка связи с сервером', 'error');
        } finally {
            btn.innerHTML = currentLang === 'en' ? 'I Paid ➔' : 'Я оплатил ➔';
            btn.disabled = false;
        }
    }

    async function cancelClientOrder() {
        if (!currentActiveOrderId) return;
        const btn = document.getElementById('orderModalCancelBtn');
        if (btn) {
            btn.innerHTML = '<div class="spinner"></div> ' + (typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Cancelling...' : 'Отмена...');
            btn.disabled = true;
        }
        try {
            const res = await fetch(`/api/orders/${currentActiveOrderId}/cancel`, {
                method: 'POST',
                headers: getAuthHeaders(),
                credentials: 'same-origin'
            });
            const data = await res.json();
            if (res.ok && data.success) {
                const statusBadge = document.getElementById('orderModalStatus');
                if (statusBadge) {
                    statusBadge.className = 'status-badge cancelled';
                    statusBadge.innerText = typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Cancelled' : 'Отменена';
                }
                const payBtn = document.getElementById('orderModalPayBtn');
                if (payBtn) payBtn.style.display = 'none';
                if (btn) btn.style.display = 'none';
                const timerBox = document.getElementById('orderModalTimerBox');
                if (timerBox) timerBox.style.display = 'none';
                if (orderTimerInterval) clearInterval(orderTimerInterval);
                const msg = document.getElementById('orderModalMsg');
                if (msg) {
                    msg.innerText = typeof currentLang !== 'undefined' && currentLang === 'en' ? '✕ Order has been cancelled.' : '✕ Заявка отменена.';
                    msg.style.color = 'var(--text-muted)';
                    msg.style.display = 'block';
                }
                showToast(typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Order cancelled' : 'Заявка отменена', 'info');
                if (typeof loadOrderHistory === 'function') loadOrderHistory();
            } else {
                showToast(data.error || (typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Error cancelling order' : 'Ошибка отмены заявки'), 'error');
            }
        } catch (e) {
            showToast(typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Server connection error' : 'Ошибка связи с сервером', 'error');
        } finally {
            if (btn) {
                btn.innerHTML = typeof currentLang !== 'undefined' && currentLang === 'en' ? '✕ Cancel Order' : '✕ Отменить заявку';
                btn.disabled = false;
            }
        }
    }

    // ==================== МОЙ ПРОФИЛЬ И РЕКВИЗИТЫ ====================

    
    let pendingTwoFaSecret = '';
    async function initTwoFa() {
        try {
            const res = await fetch('/api/auth/2fa/generate', { headers: getAuthHeaders() });
            const data = await res.json();
            if (data.success) {
                pendingTwoFaSecret = data.secret;
                document.getElementById('twofa-qr-img').src = data.qr;
                document.getElementById('btn-enable-twofa').style.display = 'none';
                document.getElementById('twofa-setup-container').style.display = 'block';
            }
        } catch(e) {}
    }

    async function confirmTwoFa() {
        const code = document.getElementById('twofa-code-input').value.trim();
        if (code.length !== 6) return showToast('Введите 6 цифр', 'error');
        try {
            const res = await fetch('/api/auth/2fa/enable', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ code, secret: pendingTwoFaSecret })
            });
            const data = await res.json();
            if (data.success) {
                showToast('2FA успешно активирована!', 'success');
                if (currentUser) currentUser.two_factor_enabled = 1;
                renderTwoFaStatus();
            } else {
                showToast(data.error || 'Неверный код', 'error');
            }
        } catch(e) {
            showToast('Ошибка', 'error');
        }
    }

    function renderTwoFaStatus() {
        if (!currentUser) return;
        const ind = document.getElementById('twofa-indicator');
        const txt = document.getElementById('twofa-status-text');
        const btn = document.getElementById('btn-enable-twofa');
        const setup = document.getElementById('twofa-setup-container');
        if (ind && txt && btn && setup) {
            if (currentUser.two_factor_enabled) {
                ind.style.background = 'var(--green)';
                txt.innerText = 'Защищено (TOTP)';
                txt.style.color = 'var(--green)';
                btn.style.display = 'none';
                setup.style.display = 'none';
            } else {
                ind.style.background = 'var(--red)';
                txt.innerText = 'Отключено';
                txt.style.color = 'var(--text-muted)';
                btn.style.display = 'block';
                setup.style.display = 'none';
            }
        }
    }

    function openProfileModal() {
        if (!currentUser) {
            showToast(typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Please log in first' : 'Пожалуйста, войдите в аккаунт', 'error');
            openAuthModal('login');
            return;
        }

        const modal = document.getElementById('profileModal');
        if (!modal) return;

        // Populate user info
        const displayName = currentUser.display_name || (currentUser.email ? currentUser.email.split('@')[0] : 'Трейдер');
        document.getElementById('profile-modal-name').innerText = displayName;
        document.getElementById('profile-modal-id').innerText = currentUser.id || '---';
        document.getElementById('profile-modal-email').innerText = currentUser.email || 'Не указан';
        document.getElementById('profile-modal-avatar').innerText = displayName.charAt(0).toUpperCase();

        // Referral link based on user id
        const refCode = 'MAO-' + (currentUser.id ? (currentUser.id * 83 + 1042) : '7729');
        const refLink = window.location.origin + '/?ref=' + refCode;
        document.getElementById('ref-link-input').value = refLink;

        loadSavedPaymentDetails();
        modal.classList.add('active');
    }

    function closeProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) modal.classList.remove('active');
    }

    function toggleAddDetailForm() {
        const form = document.getElementById('add-detail-form');
        if (form) {
            form.style.display = (form.style.display === 'none' || !form.style.display) ? 'block' : 'none';
        }
    }

    function getStorageKeyForDetails() {
        const uid = currentUser ? currentUser.id : 'guest';
        return 'mao_saved_details_' + uid;
    }

    function loadSavedPaymentDetails() {
        const listContainer = document.getElementById('saved-details-list');
        if (!listContainer) return;

        let details = [];
        try {
            details = JSON.parse(localStorage.getItem(getStorageKeyForDetails())) || [];
        } catch(e) { details = []; }

        if (details.length === 0) {
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 15px; color: var(--text-muted); font-size: 12px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                    У вас пока нет сохранённых реквизитов. Нажмите «+ Добавить», чтобы сохранить карту или кошелёк для быстрых обменов.
                </div>
            `;
            return;
        }

        listContainer.innerHTML = details.map((d, index) => {
            const escapedVal = (d.value || '').replace(/'/g, "\\'");
            return `
                <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 13px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 6px;">
                            <span>${d.label || d.type}</span>
                            <span class="badge" style="font-size: 9px; padding: 1px 6px; background: rgba(229,142,56,0.15); border-color: rgba(229,142,56,0.3); color: var(--accent-orange);">${d.type}</span>
                        </div>
                        <div style="font-size: 12px; color: var(--text-muted); font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px;">
                            ${d.value}
                        </div>
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <button onclick="useDetailInExchange('${escapedVal}')" title="Использовать для обмена" class="btn-outline" style="padding: 5px 8px; font-size: 11px; border-radius: 6px; border-color: var(--green); color: var(--green);">
                            Вставить ➔
                        </button>
                        <button onclick="copyToClipboard('${escapedVal}', 'Реквизиты скопированы!')" title="Копировать" class="btn-outline" style="padding: 5px 8px; font-size: 11px; border-radius: 6px;">
                            📋
                        </button>
                        <button onclick="deletePaymentDetail(${index})" title="Удалить" class="btn-outline" style="padding: 5px 8px; font-size: 11px; border-radius: 6px; border-color: rgba(239,68,68,0.4); color: var(--red);">
                            ✕
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function savePaymentDetail() {
        const type = document.getElementById('new-detail-type').value;
        const label = document.getElementById('new-detail-label').value.trim();
        const val = document.getElementById('new-detail-val').value.trim();

        if (!val) {
            showToast('Введите номер карты или адрес кошелька', 'error');
            return;
        }

        let details = [];
        try {
            details = JSON.parse(localStorage.getItem(getStorageKeyForDetails())) || [];
        } catch(e) { details = []; }

        details.push({
            type: type,
            label: label || type,
            value: val,
            created_at: new Date().toISOString()
        });

        localStorage.setItem(getStorageKeyForDetails(), JSON.stringify(details));
        document.getElementById('new-detail-label').value = '';
        document.getElementById('new-detail-val').value = '';
        toggleAddDetailForm();
        loadSavedPaymentDetails();
        showToast('Реквизит успешно сохранён в адресную книгу!', 'success');
    }

    function deletePaymentDetail(index) {
        let details = [];
        try {
            details = JSON.parse(localStorage.getItem(getStorageKeyForDetails())) || [];
        } catch(e) { details = []; }

        details.splice(index, 1);
        localStorage.setItem(getStorageKeyForDetails(), JSON.stringify(details));
        loadSavedPaymentDetails();
        showToast('Реквизит удалён', 'success');
    }

    function useDetailInExchange(val) {
        const walletInput = document.getElementById('user-wallet');
        if (walletInput) {
            walletInput.value = val;
            if (typeof validateWalletInput === 'function') validateWalletInput();
        }
        closeProfileModal();
        switchTab('main');
        window.scrollTo({ top: 300, behavior: 'smooth' });
        showToast('Реквизиты подставлены в форму обмена!', 'success');
    }

    function copyRefLink() {
        const input = document.getElementById('ref-link-input');
        if (input && input.value) {
            copyToClipboard(input.value, 'Реферальная ссылка скопирована в буфер!');
        }
    }

    // ==================== ИСТОРИЯ ЗАЯВОК ====================

    async function toggleHistoryModal(show) {
        const modal = document.getElementById('historyModal');
        modal.classList.toggle('active', show);
        if (show) {
            loadUserOrders();
        }
    }

    async function loadUserOrders() {
        const tbody = document.getElementById('user-orders-tbody');
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 15px; color:var(--text-muted);"><div class="spinner" style="margin:auto;"></div></td></tr>';

        try {
            const res = await fetch('/api/user/orders', { headers: getAuthHeaders() });
            const orders = await res.json();
            if (!orders || orders.length === 0) {
                tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-muted); padding:20px;">${currentLang === 'en' ? 'You have no exchange orders yet' : 'У вас пока нет заявок'}</td></tr>`;
                return;
            }

            tbody.innerHTML = orders.map(o => {
                const statusClass = o.status === 'completed' ? 'completed' : (o.status === 'paid' ? 'paid' : (o.status === 'cancelled' ? 'declined' : 'new'));
                const statusTitle = currentLang === 'en'
                    ? (o.status === 'completed' ? 'Completed' : (o.status === 'paid' ? 'Paid' : (o.status === 'cancelled' ? 'Declined' : 'Pending')))
                    : (o.status === 'completed' ? 'Выполнен' : (o.status === 'paid' ? 'Оплачен' : (o.status === 'cancelled' ? 'Отклонен' : 'Ожидает')));
                return `
                    <tr style="cursor:pointer;" onclick="viewOrderDetails(${o.id})">
                        <td style="font-weight:700; color:#fff;">#MAO-${o.id}</td>
                        <td>${o.amount_give} ${o.from_currency} ➔ ${o.amount_get} ${o.to_currency}</td>
                        <td><span class="status-badge ${statusClass}">${statusTitle}</span></td>
                    </tr>
                `;
            }).join('');
        } catch (e) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--red); padding:15px;">${currentLang === 'en' ? 'Error loading order history' : 'Ошибка загрузки истории'}</td></tr>`;
        }
    }

    async function viewOrderDetails(id) {
        try {
            const res = await fetch(`/api/orders/${id}`);
            const order = await res.json();
            if (order && order.id) {
                toggleHistoryModal(false);
                openOrderModal(order);
            }
        } catch (e) {}
    }

    // ==================== ЧАТ ПОДДЕРЖКИ ====================

    function toggleChat(show) {
        const win = document.getElementById('chatWindow');
        if (show === undefined) win.classList.toggle('active');
        else win.classList.toggle('active', show);

        if (win.classList.contains('active')) {
            loadChatMessages();
            if (chatPollInterval) clearInterval(chatPollInterval);
            chatPollInterval = setInterval(loadChatMessages, 3000);
        } else {
            if (chatPollInterval) clearInterval(chatPollInterval);
        }
    }

    async function loadChatMessages() {
        try {
            const res = await fetch('/api/support/messages', { credentials: 'same-origin', headers: getAuthHeaders() });
            const messages = await res.json();
            const msgs = document.getElementById('chatMessages');
            const defaultGreeting = currentLang === 'en' 
                ? 'Hello! How can I assist you with your exchange today?' 
                : 'Здравствуйте! Чем я могу помочь вам по поводу обмена?';

            if (!messages || messages.length === 0) {
                msgs.innerHTML = `<div class="msg support">${defaultGreeting}</div>`;
                return;
            }
            let html = `<div class="msg support">${defaultGreeting}</div>`;
            messages.forEach(m => {
                const isAgent = m.sender === 'agent';
                const cls = isAgent ? 'support' : 'user';
                const senderLabel = isAgent 
                    ? (currentLang === 'en' ? 'Support Agent' : 'Оператор MAO') 
                    : (currentUser ? (currentUser.display_name || `User #${currentUser.id}`) : (currentLang === 'en' ? 'You' : 'Вы'));
                
                html += `
                    <div class="msg ${cls}">
                        <div style="font-size:10px; opacity:0.75; margin-bottom:3px; font-weight:700;">${escapeHtml(senderLabel)}</div>
                        <div>${escapeHtml(m.message)}</div>
                    </div>
                `;
            });
            msgs.innerHTML = html;
            msgs.scrollTop = msgs.scrollHeight;
        } catch (e) {}
    }

    
    async function uploadChatImage() {
        const fileInput = document.getElementById('chatImageUpload');
        const file = fileInput.files[0];
        if (!file) return;
        
        // Prevent huge files (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast(currentLang === 'en' ? 'File is too large (max 5MB)' : 'Файл слишком большой (максимум 5MB)', 'error');
            fileInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = async function(e) {
            const base64 = e.target.result;
            try {
                const res = await fetch('/api/support/upload', { credentials: 'same-origin',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                    body: JSON.stringify({ imageBase64: base64 })
                });
                const data = await res.json();
                if (data.success) {
                    const imgMarkdown = `[IMAGE]${data.url}`;
                    
                    // Emit via socket
                    if (typeof socket !== 'undefined' && socket && socket.connected) {
                        socket.emit('user:chat_send', { message: imgMarkdown });
                    } else {
                        await fetch('/api/support/messages', { credentials: 'same-origin',
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                            body: JSON.stringify({ message: imgMarkdown })
                        });
                    }
                } else {
                    showToast(data.error || 'Ошибка загрузки изображения', 'error');
                }
            } catch(err) {
                showToast(currentLang === 'en' ? 'Upload error' : 'Ошибка загрузки изображения', 'error');
            }
            fileInput.value = '';
        };
        reader.readAsDataURL(file);
    }

    async function sendMessage() {
        const input = document.getElementById('chatInput');
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        
        const msgs = document.getElementById('chatMessages');
        const senderLabel = currentUser ? (currentUser.display_name || `User #${currentUser.id}`) : (currentLang === 'en' ? 'You' : 'Вы');
        msgs.innerHTML += `
            <div class="msg user">
                <div style="font-size:10px; opacity:0.75; margin-bottom:3px; font-weight:700;">${escapeHtml(senderLabel)}</div>
                <div>${text.startsWith('[IMAGE]') ? '<img src="' + escapeHtml(text.replace('[IMAGE]', '')) + '" style="max-width:100%; border-radius:8px; margin-top:5px; max-height:150px;" />' : escapeHtml(text)}</div>
            </div>
        `;
        msgs.scrollTop = msgs.scrollHeight;

        // Emit via socket
        if (typeof socket !== 'undefined' && socket && socket.connected) {
            socket.emit('user:chat_send', { message: text });
        } else {
            // Fallback
            try {
                const headers = getAuthHeaders();
                headers['Content-Type'] = 'application/json';
                await fetch('/api/support/messages', { credentials: 'same-origin',
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ message: text })
                });
            } catch(e) {}
        }
    }



    function escapeHtml(text) {
        const div = document.createElement('div');
        div.innerText = text;
        return div.innerHTML;
    }

    // ==================== МУЛЬТИЯЗЫЧНОСТЬ (RU / EN) ====================
    let currentLang = localStorage.getItem('mao_lang') || 'ru';

    const translations = {
        ru: {
            'nav-main': 'Главная',
            'nav-p2p': 'P2P',
            'btn-login': 'Войти',
            'ud-guest': 'Гость',
            'ud-unauth': 'Не авторизован',
            'ud-login': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Войти в аккаунт',
            'ud-history': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> История транзакций',
            'ud-logout': 'Выйти',
            'hero-title': 'MAO Exchange - терминал P2P и спотовой ликвидности',
            'hero-sub': 'Биржевые курсы. Смарт-контрактный Escrow. 0% KYC.',
            'badge-aml': '✦ AML: 100% Clean',
            'badge-instant': '✦ SLA: 2м 14с',
            'badge-rate': '✦ Spread: 0.1%',
            'card-give': '01 - Отдаёте',
            'select-asset': 'Выберите актив',
            'tab-fiat': 'Фиат',
            'tab-crypto': 'Крипто',
            'tab-stable': 'Стейбл',
            'p2p-hero-sub': 'Обмен происходит напрямую между пользователями, а сервис выступает escrow-гарантом сделки. 0% комиссия.',
            'p2p-btn-create-ad': 'Создать объявление',
            'p2p-btn-my-deals': 'Текущие сделки',
            'p2p-btn-buy': 'Купить',
            'p2p-btn-sell': 'Продать',
            'wallet-invalid': 'Неверный формат реквизитов',
            'placeholder-wallet': 'Введите реквизиты...',
            'tab-fiat-2': 'Фиат',
            'tab-crypto-2': 'Крипто',
            'tab-stable-2': 'Стейбл',
            'card-get': '02 - Получаете',
            'card-checkout': '03 - Оформление заявки',
            'label-rate': 'Курс обмена:',
            'loading': 'Загрузка...',
            'label-fee': 'Комиссия:',
            'label-time': 'Время обработки:',
            'value-time': '2–5 минут',
            'label-wallet': 'Адрес / Карта для получения:',
            'placeholder-wallet': 'Введите реквизиты...',
            'btn-create-order': 'Создать заявку ➔',
            'adv-header-sm': 'Преимущества',
            'adv-title': 'Архитектура ликвидности',
            'adv-speed-t': 'SLA: 2м 14с',
            'adv-speed-sub': 'Авто-штрафы мейкеров за просрочку отпуска. Мониторинг резервов 24/7.',
            'adv-sec-t': 'Smart-Escrow',
            'adv-sec-sub': 'Блокировка активов до фиата. Полная защита от треуголов.',
            'adv-sup-t': 'Арбитраж',
            'adv-sup-sub': 'Прямое вмешательство саппорта при попытках скама в P2P-секции.',
            'adv-fee-t': 'Комиссии',
            'adv-fee-sub': 'Жесткая фиксация курса в момент ордера. Никаких плавающих комиссий.',
            'act-header-sm': 'Activity',
            'act-title': 'Последние обмены',
            'act-th-dir': 'Направление',
            'act-th-amount': 'Сумма',
            'act-th-status': 'Статус',
            'act-th-time': 'Когда',
            'status-completed': 'Выполнен',
            'status-moderation': 'В обработке',
            'status-cancelled': 'Отменен',
            'status-waiting': 'Ожидает',
            'timing-just-now': 'только что',
            'timing-seconds-ago': 'пару секунд назад',
            'timing-1-min': '1 мин назад',
            'timing-2-min': '2 мин назад',
            'trust-header-sm': 'О сервисе',
            'trust-main-title': 'MAO Exchange',
            'trust-t1': 'Мгновенная обработка',
            'trust-sub1': 'Среднее время выполнения заявки - менее 5 минут. Автоматическая система отслеживает поступление средств и моментально отправляет выплату на указанные реквизиты.',
            'trust-t2': 'Арбитраж 24/7',
            'trust-sub2': 'Операторы на связи круглосуточно без выходных. Любой вопрос по обмену решается в чате за считанные минуты - без ожидания и переадресации.',
            'trust-t3': 'Без скрытых комиссий',
            'trust-sub3': 'Курс и итоговая сумма фиксируются до оплаты. Вы видите ровно ту сумму, которую получите - никаких дополнительных сборов и наценок.',
            'trust-t4': 'Live Market Binance',
            'trust-sub4': 'Курсы обновляются каждые 5 секунд напрямую с Binance API. Вы всегда работаете с актуальными рыночными ценами без задержек.',
            'p2p-header-sm': 'P2P Market',
            'p2p-title': 'P2P Обмен',
            'p2p-desc': 'Торговля напрямую между пользователями с эскроу гарантией.',
            'p2p-btn': 'Перейти ➔',
            'rates-header-sm': 'Котировки',
            'rates-box-title': 'Курсы в реальном времени',
            'rates-box-desc': 'Прямое подключение к стакану ликвидности крупнейших мировых бирж.',
            'reviews-header-sm': 'Отзывы',
            'reviews-title': 'Клиенты MAO',
            'reviews-box-title': 'Что говорят клиенты',
            'btn-all-reviews': 'Все отзывы ➔',
            'footer-rights': '© 2026 MAO Exchange. Все права защищены.',
            'footer-aml': 'AML Политика',
            'faq-q3': 'Есть ли заморозка (T+1) для новых?',
            'faq-a3': 'Блокировок T+1 нет. Однако сделки новых пользователей с повышенным риск-скорингом могут отправляться на ручной клиринг (до 5 минут) в целях защиты P2P-пула.',
            'reviews-modal-title': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-orange);"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> Отзывы клиентов',
            'reviews-modal-subtitle': 'Честные мнения пользователей о работе сервиса',
            'pagination-prev': '← Предыдущая',
            'pagination-next': 'Следующая →',
            'reviews-leave-title': 'Оставить свой отзыв',
            'reviews-auth-warning': 'Чтобы оставить отзыв, необходимо авторизоваться в системе!',
            'reviews-submit-btn': 'Отправить отзыв',
            'login-title': 'Вход в личный кабинет',
            'login-no-account': 'Нет аккаунта?',
            'login-join': 'Присоединиться',
            'btn-tg-login': 'Войти через Telegram',
            'divider-or-email': 'или по E-mail',
            'login-label-email': 'Введите e-mail адрес',
            'login-label-password': 'Введите пароль',
            'login-forgot': 'Забыли пароль?',
            'login-btn-submit': 'Войти',
            'reg-title': 'Регистрация',
            'reg-have-account': 'Есть аккаунт?',
            'reg-login-link': 'Войти',
            'reg-label-email': 'Введите e-mail адрес',
            'reg-label-password': 'Введите пароль',
            'reg-label-confirm': 'Введите пароль повторно',
            'reg-btn-submit': 'Зарегистрироваться',
            'reg-confirm-title': 'Подтверждение E-mail',
            'reg-confirm-sub': 'Мы отправили код на',
            'reg-code-label': 'Код подтверждения из письма',
            'reg-code-btn': 'Подтвердить код',
            'reg-resend-link': 'Запросить код еще раз',
            'forgot-title': 'Сброс пароля',
            'forgot-remember': 'Вспомнили пароль?',
            'forgot-login-link': 'Авторизуйтесь',
            'forgot-label-email': 'Введите e-mail адрес',
            'forgot-btn-send': 'Отправить код',
            'forgot-step2-title': 'Новый пароль',
            'forgot-sent-to': 'Код отправлен на',
            'forgot-label-code': 'Код из письма',
            'forgot-label-newpass': 'Новый пароль',
            'forgot-label-confirmpass': 'Подтвердите пароль',
            'forgot-btn-save': 'Изменить пароль',
            'history-title': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-orange);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> История обменов',
            'wallet-invalid': 'Неверный формат реквизитов',
            'history-subtitle': 'Ваши недавние заявки:',
            'history-th-id': 'ID Заявки',
            'history-th-order': 'Обмен',
            'history-th-status': 'Статус',
            'history-loading': 'Загрузка истории...',
            'order-status-waiting': 'Ожидает оплаты',
            'order-send-label': 'Сумма к отправке:',
            'order-req-label': 'Реквизиты сервиса (переведите средства сюда):',
            'btn-copy': 'Копировать',
            'order-timer-label': 'Осталось времени на оплату:',
            'order-btn-paid': 'Я оплатил ➔',
            'chat-title': 'Арбитраж MAO Exchange',
            'chat-greeting': 'Здравствуйте! Чем я могу помочь вам по поводу обмена?',
            'p2p-hero-sub': 'Обмен происходит между двумя людьми, а сервис выступает <span class="escrow-link" onclick="openEscrowModal()">escrow</span>-гарантом сделки. 0% комиссия.',
            'escrow-modal-title': 'Что такое Escrow?',
            'escrow-modal-text': 'Escrow (эскроу) - это безопасный счет-гарант. Когда вы открываете сделку, криптовалюта продавца временно блокируется на смарт-контракте платформы.<br><br>Она будет отправлена покупателю только после того, как обе стороны подтвердят успешный перевод средств. Это полностью исключает риск мошенничества.',
            'escrow-modal-btn': 'Понятно',
            'p2p-btn-create-ad': 'Создать объявление',
            'p2p-btn-buy': 'Купить',
            'p2p-btn-sell': 'Продать',
            'p2p-opt-all': 'Все способы',
            'p2p-calc-maker': 'Мейкер: ',
            'p2p-calc-rate': ' | Курс: ',
            'p2p-calc-give-buy': 'Я отдаю (RUB)',
            'p2p-calc-get-buy': 'Я получу (USDT)',
            'p2p-calc-give-sell': 'Я отдаю (USDT)',
            'p2p-calc-get-sell': 'Я получу (RUB)',
            'p2p-calc-hint': 'Введите сумму для обмена.',
            'p2p-calc-confirm': 'Подтвердить сделку',
            'p2p-req-title': 'Требования к мейкерам',
            'p2p-req-desc': 'Для публикации своих объявлений (статус Мейкера) и работы без блокировок, необходимо подтвердить контакты через нашего Telegram-бота.',
            'p2p-req-tg': 'Telegram (Обязательно)',
            'p2p-req-unlinked': 'Не привязан',
            'p2p-req-linked': 'Привязан',
            'p2p-req-phone': 'Номер телефона',
            'p2p-req-phone-desc': 'Необходимо для оперативной связи.',
            'p2p-req-email': 'Email',
            'p2p-req-email-desc': 'Защита аккаунта.',
            'p2p-req-warn': 'Вы должны привязать Telegram для продолжения!',
            'p2p-req-continue': 'Я всё привязал, продолжить',
            'p2p-ad-title': 'Новое объявление',
            'p2p-ad-type': 'Тип',
            'p2p-ad-asset': 'Актив',
            'p2p-ad-price': 'Цена',
            'p2p-ad-limits-range': 'Лимиты (от - до)',
            'p2p-ad-payment-methods': 'Способы оплаты',
            'p2p-ad-type-buy': 'Купить (Вы хотите купить крипту)',
            'p2p-ad-type-sell': 'Продать (Вы хотите продать крипту)',
            'p2p-ad-crypto': 'Криптовалюта',
            'p2p-ad-fiat': 'Фиат',
            'p2p-ad-rate': 'Курс (RUB)',
            'p2p-ad-limits': 'Лимиты (Мин / Макс)',
            'p2p-ad-pm': 'Методы оплаты',
            'p2p-ad-publish': 'Опубликовать',
            'p2p-req-tg-ph': 'Введите реквизиты Telegram (напр: @username)',
            'p2p-req-phone-ph': 'Введите номер телефона',
            'p2p-req-email-ph': 'Введите Email'
        },
        en: {
            'nav-main': 'Home',
            'nav-p2p': 'P2P',
            'btn-login': 'Sign In',
            'ud-guest': 'Guest',
            'ud-unauth': 'Not Authorized',
            'ud-login': '🔑 Sign In',
            'ud-history': '📋 Exchange History',
            'ud-logout': 'Log Out',
            'hero-title': 'MAO Exchange - Instant Crypto Swaps',
            'hero-sub': 'Live prices from Binance API. Fast and secure asset exchange.',
            'badge-aml': '✦ Automated AML Check',
            'badge-instant': '✦ Instant Payouts',
            'badge-rate': '✦ Best Rates',
            'card-give': '01 - You Send',
            'select-asset': 'Select Asset',
            'tab-fiat': 'Fiat',
            'tab-crypto': 'Crypto',
            'tab-stable': 'Stable',
            'p2p-hero-sub': 'Exchange directly between users with our escrow service acting as a guarantor. 0% commission.',
            'p2p-btn-create-ad': 'Create Ad',
            'p2p-btn-my-deals': 'My Deals',
            'p2p-btn-buy': 'Buy',
            'p2p-btn-sell': 'Sell',
            'wallet-invalid': 'Invalid address format',
            'placeholder-wallet': 'Enter address...',
            'tab-fiat-2': 'Fiat',
            'tab-crypto-2': 'Crypto',
            'tab-stable-2': 'Stable',
            'card-get': '02 - You Receive',
            'card-checkout': '03 - Order Checkout',
            'label-rate': 'Exchange Rate:',
            'loading': 'Loading...',
            'label-fee': 'Fee:',
            'label-time': 'Processing Time:',
            'value-time': '2–5 minutes',
            'label-wallet': 'Receiving Address / Card:',
            'placeholder-wallet': 'Enter receiving requisites...',
            'btn-create-order': 'Create Order ➔',
            'adv-header-sm': 'Advantages',
            'adv-title': 'Why Choose MAO Exchange',
            'adv-speed-t': 'Payout Speed',
            'adv-speed-sub': 'Average order processing time is under 5 minutes',
            'adv-sec-t': 'Fund Protection',
            'adv-sec-sub': 'Guaranteed safety of your transactions and data',
            'adv-sup-t': 'Support',
            'adv-sup-sub': '24/7 prompt assistance for all your questions',
            'adv-fee-t': 'Zero Hidden Fees',
            'adv-fee-sub': 'Guaranteed locked exchange rate before you make payment',
            'act-header-sm': 'Activity',
            'act-title': 'Recent Exchanges',
            'act-th-dir': 'Pair',
            'act-th-amount': 'Amount',
            'act-th-status': 'Status',
            'act-th-time': 'Time',
            'status-completed': 'Completed',
            'status-moderation': 'Processing',
            'status-cancelled': 'Cancelled',
            'status-waiting': 'Waiting',
            'timing-just-now': 'just now',
            'timing-seconds-ago': 'a few seconds ago',
            'timing-1-min': '1 min ago',
            'timing-2-min': '2 min ago',
            'trust-header-sm': 'About Us',
            'trust-main-title': 'MAO Exchange',
            'trust-t1': 'Instant Processing',
            'trust-sub1': 'Average order execution time is under 5 minutes. The automated system tracks funds and sends payouts instantly to your provided requisites.',
            'trust-t2': '24/7 Support',
            'trust-sub2': 'Our operators are available 24/7 without days off. Any exchange issues are resolved via live chat in minutes - no waiting or redirecting.',
            'trust-t3': 'No Hidden Fees',
            'trust-sub3': 'The exchange rate and final amount are locked before payment. You see exactly the amount you will receive - no extra charges or markups.',
            'trust-t4': 'Live Market Binance',
            'trust-sub4': 'Rates update every 5 seconds directly from the Binance API. You always trade with real-time market prices without delays.',
            'p2p-header-sm': 'P2P Market',
            'p2p-title': 'P2P Exchange',
            'p2p-desc': 'Direct peer-to-peer trading with escrow protection.',
            'p2p-btn': 'Open ➔',
            'rates-header-sm': 'Market Quotes',
            'rates-box-title': 'Real-Time Market Rates',
            'rates-box-desc': 'Direct liquidity connection to major global exchanges.',
            'reviews-header-sm': 'Reviews',
            'reviews-title': 'MAO Clients',
            'reviews-box-title': 'What Clients Say',
            'btn-all-reviews': 'All Reviews ➔',
            'footer-rights': '© 2026 MAO Exchange. All rights reserved.',
            'footer-aml': 'AML Policy',
            'faq-q3': 'Is identity verification or KYC required?',
            'faq-a3': 'No, KYC verification is completely omitted. We value your privacy: exchanges require no ID, selfies, or documents. All transactions undergo automated AML screening to guarantee clean liquidity.',
            'reviews-modal-title': '💬 Client Reviews',
            'reviews-modal-subtitle': 'Verified customer feedback about MAO Exchange',
            'pagination-prev': '← Previous',
            'pagination-next': 'Next →',
            'reviews-leave-title': 'Leave a Review',
            'reviews-auth-warning': 'You must be signed in to submit a review!',
            'reviews-submit-btn': 'Submit Review',
            'login-title': 'Sign In to Account',
            'login-no-account': 'No account?',
            'login-join': 'Sign Up',
            'btn-tg-login': 'Sign in with Telegram',
            'divider-or-email': 'or via E-mail',
            'login-label-email': 'Enter e-mail address',
            'login-label-password': 'Enter password',
            'login-forgot': 'Forgot password?',
            'login-btn-submit': 'Sign In',
            'reg-title': 'Registration',
            'reg-have-account': 'Already have an account?',
            'reg-login-link': 'Sign In',
            'reg-label-email': 'Enter e-mail address',
            'reg-label-password': 'Enter password',
            'reg-label-confirm': 'Confirm password',
            'reg-btn-submit': 'Sign Up',
            'reg-confirm-title': 'E-mail Verification',
            'reg-confirm-sub': 'We sent a verification code to',
            'reg-code-label': 'Verification code from email',
            'reg-code-btn': 'Verify Code',
            'reg-resend-link': 'Resend code',
            'forgot-title': 'Password Reset',
            'forgot-remember': 'Remember your password?',
            'forgot-login-link': 'Sign In',
            'forgot-label-email': 'Enter e-mail address',
            'forgot-btn-send': 'Send Code',
            'forgot-step2-title': 'New Password',
            'forgot-sent-to': 'Code sent to',
            'forgot-label-code': 'Code from email',
            'forgot-label-newpass': 'New password',
            'forgot-label-confirmpass': 'Confirm password',
            'forgot-btn-save': 'Save Password',
            'history-title': '📋 Exchange History',
            'wallet-invalid': 'Invalid details format',
            'history-subtitle': 'Your recent orders:',
            'history-th-id': 'Order ID',
            'history-th-order': 'Pair',
            'history-th-status': 'Status',
            'chat-title': 'MAO Exchange Support',
                        'chat-title': 'MAO Exchange Support',
            'chat-greeting': 'Hello! How can I assist you with your exchange today?',
            'p2p-hero-sub': 'Direct P2P exchange between users with a secure <span class="escrow-link" onclick="openEscrowModal()">Escrow</span> guarantee. 0% commission.',
            'escrow-modal-title': 'What is Escrow?',
            'escrow-modal-text': 'Escrow is a secure holding account. When a trade is opened, the seller\'s cryptocurrency is temporarily locked in the platform\'s smart contract.<br><br>It will only be released to the buyer after both parties confirm the successful transfer of funds. This completely eliminates the risk of fraud.',
            'escrow-modal-btn': 'Understood',
            'p2p-btn-create-ad': 'Create Ad',
            'p2p-btn-buy': 'Buy',
            'p2p-btn-sell': 'Sell',
            'p2p-opt-all': 'All methods',
            'p2p-calc-maker': 'Maker: ',
            'p2p-calc-rate': ' | Rate: ',
            'p2p-calc-give-buy': 'I give (RUB)',
            'p2p-calc-get-buy': 'I get (USDT)',
            'p2p-calc-give-sell': 'I give (USDT)',
            'p2p-calc-get-sell': 'I get (RUB)',
            'p2p-calc-hint': 'Enter amount to exchange.',
            'p2p-calc-confirm': 'Confirm trade',
            'p2p-req-title': 'Maker Requirements',
            'p2p-req-desc': 'To publish your ads (Maker status) and work without locks, you need to verify your contacts via our Telegram bot.',
            'p2p-req-tg': 'Telegram (Required)',
            'p2p-req-unlinked': 'Not linked',
            'p2p-req-linked': 'Linked',
            'p2p-req-phone': 'Phone number',
            'p2p-req-phone-desc': 'Required for operational communication.',
            'p2p-req-email': 'Email',
            'p2p-req-email-desc': 'Account security.',
            'p2p-req-warn': 'You must link Telegram to continue!',
            'p2p-req-continue': "I've linked everything, continue",
            'p2p-ad-title': 'New Advertisement',
            'p2p-ad-type': 'Type',
            'p2p-ad-asset': 'Asset',
            'p2p-ad-price': 'Price',
            'p2p-ad-limits-range': 'Limits (from - to)',
            'p2p-ad-payment-methods': 'Payment Methods',
            'p2p-ad-type-buy': 'Buy (You want to buy crypto)',
            'p2p-ad-type-sell': 'Sell (You want to sell crypto)',
            'p2p-ad-crypto': 'Cryptocurrency',
            'p2p-ad-fiat': 'Fiat',
            'p2p-ad-rate': 'Rate (RUB)',
            'p2p-ad-limits': 'Limits (Min / Max)',
            'p2p-ad-pm': 'Payment Methods',
            'p2p-ad-publish': 'Publish',
            'p2p-req-tg-ph': 'Enter Telegram details (e.g. @username)',
            'p2p-req-phone-ph': 'Enter phone number',
            'p2p-req-email-ph': 'Enter Email',
            'p2p-btn-create-ad': 'Create Ad',
            'p2p-btn-buy': 'Buy',
            'p2p-btn-sell': 'Sell',
            'p2p-opt-all': 'All methods',
            'p2p-calc-maker': 'Maker: ',
            'p2p-calc-rate': ' | Rate: ',
            'p2p-calc-give-buy': 'I give (RUB)',
            'p2p-calc-get-buy': 'I get (USDT)',
            'p2p-calc-give-sell': 'I give (USDT)',
            'p2p-calc-get-sell': 'I get (RUB)',
            'p2p-calc-hint': 'Enter amount to exchange.',
            'p2p-calc-confirm': 'Confirm trade',
            'p2p-req-title': 'Maker Requirements',
            'p2p-req-desc': 'To publish your ads (Maker status) and work without locks, you need to verify your contacts via our Telegram bot.',
            'p2p-req-tg': 'Telegram (Required)',
            'p2p-req-unlinked': 'Not linked',
            'p2p-req-linked': 'Linked',
            'p2p-req-phone': 'Phone number',
            'p2p-req-phone-desc': 'Required for operational communication.',
            'p2p-req-email': 'Email',
            'p2p-req-email-desc': 'Account security.',
            'p2p-req-warn': 'You must link Telegram to continue!',
            'p2p-req-continue': "I've linked everything, continue",
            'p2p-ad-title': 'New Advertisement',
            'p2p-ad-type': 'Type',
            'p2p-ad-asset': 'Asset',
            'p2p-ad-price': 'Price',
            'p2p-ad-limits-range': 'Limits (from - to)',
            'p2p-ad-payment-methods': 'Payment Methods',
            'p2p-ad-type-buy': 'Buy (You want to buy crypto)',
            'p2p-ad-type-sell': 'Sell (You want to sell crypto)',
            'p2p-ad-crypto': 'Cryptocurrency',
            'p2p-ad-fiat': 'Fiat',
            'p2p-ad-rate': 'Rate (RUB)',
            'p2p-ad-limits': 'Limits (Min / Max)',
            'p2p-ad-pm': 'Payment Methods',
            'p2p-ad-publish': 'Publish',
            'p2p-req-tg-ph': 'Enter Telegram details (e.g. @username)',
            'p2p-req-phone-ph': 'Enter phone number',
            'p2p-req-email-ph': 'Enter Email'
        }
    };

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('mao_lang', lang);
        const btn = document.getElementById('lang-toggle-btn');
        if (lang === 'en') {
            document.body.classList.add('lang-en');
            if (btn) btn.innerText = 'RU';
        } else {
            document.body.classList.remove('lang-en');
            if (btn) btn.innerText = 'EN';
        }

        const dict = translations[lang] || translations.ru;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = dict[key];
                } else {
                    el.innerHTML = dict[key];
                }
            }
        });

        // Live translate existing rows in Activity table
        const timingMapRu = ['только что', 'пару секунд назад', '15 секунд назад', '30 секунд назад', '1 мин назад', '2 мин назад', '3 мин назад', '5 мин назад', '8 мин назад', '10 мин назад', '12 мин назад', '15 мин назад'];
        const timingMapEn = ['just now', 'a few seconds ago', '15 seconds ago', '30 seconds ago', '1 min ago', '2 min ago', '3 min ago', '5 min ago', '8 min ago', '10 min ago', '12 min ago', '15 min ago'];
        const statusMapRu = { 'completed': 'Выполнен', 'moderation': 'В обработке', 'cancelled': 'Отменен' };
        const statusMapEn = { 'completed': 'Completed', 'moderation': 'Moderation', 'cancelled': 'Cancelled' };

        document.querySelectorAll('#activity-tbody tr').forEach(row => {
            const badge = row.querySelector('.status-badge');
            if (badge) {
                const statClass = badge.getAttribute('data-stat-class') || (badge.classList.contains('completed') ? 'completed' : (badge.classList.contains('moderation') ? 'moderation' : 'cancelled'));
                badge.innerText = lang === 'en' ? (statusMapEn[statClass] || statClass) : (statusMapRu[statClass] || statClass);
            }
            const timeTd = row.querySelectorAll('td')[3];
            if (timeTd) {
                const idx = parseInt(timeTd.getAttribute('data-timing-idx')) || 0;
                timeTd.innerText = lang === 'en' ? (timingMapEn[idx] || '2 min ago') : (timingMapRu[idx] || '2 мин назад');
            }
        });

        // Translate dynamic placeholders
        const userWallet = document.getElementById('user-wallet');
        if (userWallet) userWallet.placeholder = lang === 'en' ? 'Enter receiving requisites...' : 'Введите реквизиты...';

        
        // P2P Dynamic Card Translations
        document.querySelectorAll('.bento-price-label').forEach(el => {
            el.innerText = lang === 'en' ? 'Exchange Rate' : 'Курс обмена';
        });
        document.querySelectorAll('.bento-buy-btn').forEach(el => {
            const coin = el.closest('.p2p-bento-card').getAttribute('data-coin') || 'USDT';
            el.innerText = lang === 'en' ? `Buy ${coin}` : `Купить ${coin}`;
        });
        document.querySelectorAll('.bento-sell-btn').forEach(el => {
            const coin = el.closest('.p2p-bento-card').getAttribute('data-coin') || 'USDT';
            el.innerText = lang === 'en' ? `Sell ${coin}` : `Продать ${coin}`;
        });
        document.querySelectorAll('.limit-text span:first-child').forEach(el => {
            if(el.innerText.includes('Доступно:') || el.innerText.includes('Available:')) {
                const amount = el.innerText.split(': ')[1];
                el.innerText = (lang === 'en' ? 'Available: ' : 'Доступно: ') + amount;
            }
        });
        document.querySelectorAll('.bento-stats').forEach(el => {
            let html = el.innerHTML;
            if (lang === 'en') {
                html = html.replace('сделок', 'deals');
                html = html.replace('исполнено', 'executed');
                html = html.replace('мин.', 'min.');
            } else {
                html = html.replace('deals', 'сделок');
                html = html.replace('executed', 'исполнено');
                html = html.replace('min.', 'мин.');
            }
            el.innerHTML = html;
        });
        
        // Banks translation inside cards and dropdown
        const banksMapEn = {'Сбербанк': 'Sberbank', 'Т-Банк': 'T-Bank', 'Райффайзенбанк': 'Raiffeisen', 'Альфа-Банк': 'Alfa-Bank', 'Наличные': 'Cash'};
        const banksMapRu = {'Sberbank': 'Сбербанк', 'T-Bank': 'Т-Банк', 'Raiffeisen': 'Райффайзенбанк', 'Alfa-Bank': 'Альфа-Банк', 'Cash': 'Наличные'};
        document.querySelectorAll('.bank-pill, option').forEach(el => {
            let t = el.innerText;
            // Clean up if it's an option that has "(T-Bank)" inside
            if (el.tagName === 'OPTION') {
                if (t === 'Т-Банк (T-Bank)' && lang === 'en') el.innerText = 'T-Bank';
                if (t === 'T-Bank' && lang === 'ru') el.innerText = 'Т-Банк (T-Bank)';
                
                if (lang === 'en' && banksMapEn[t]) el.innerText = banksMapEn[t];
                if (lang === 'ru' && banksMapRu[t]) el.innerText = banksMapRu[t];
            } else {
                if (lang === 'en' && banksMapEn[t]) el.innerText = banksMapEn[t];
                if (lang === 'ru' && banksMapRu[t]) el.innerText = banksMapRu[t];
            }
        });
        
        
        
const chatInput = document.getElementById('chatInput');
        if (chatInput) chatInput.placeholder = lang === 'en' ? 'Type a message...' : 'Напишите сообщение...';

        const newReviewText = document.getElementById('newReviewText');
        if (newReviewText) newReviewText.placeholder = lang === 'en' ? 'Your review...' : 'Ваш отзыв...';

        const headerBtn = document.getElementById('header-auth-btn');
        if (headerBtn && !currentUser) {
            headerBtn.innerText = lang === 'en' ? 'Sign In' : 'Войти';
        }
    }

    function toggleLanguage() {
        setLanguage(currentLang === 'ru' ? 'en' : 'ru');
    }

    document.getElementById('amount-give').addEventListener('input', recalculate);
    document.getElementById('user-wallet').addEventListener('input', () => document.getElementById('wallet-error').style.display = 'none');

    window.onload = async () => {
        buildCurrencyTree('from-tree', 'from', 'fiat');
        buildCurrencyTree('to-tree', 'to', 'crypto');
        await fetchBinanceRates();
        
        const firstFrom = document.getElementById('from-tree').children[0];
        if (firstFrom) firstFrom.querySelector('.coin-header').click(); 
        
        const firstTo = document.getElementById('to-tree').children[0];
        if (firstTo) firstTo.querySelector('.coin-header').click(); 

        await checkCurrentAuth();
        setInterval(fetchBinanceRates, 5000);

        // Применяем сохраненный язык
        setLanguage(currentLang);

        // Загружаем превью отзывов (3 карточки)
        loadReviewsPreview();

        // Запуск синхронизации активности
        fetchActivity();
        setInterval(fetchActivity, 30000);
    };
