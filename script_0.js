
    function showToast(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = 'toast-msg ' + type;
        const icon = type === 'error' ? '⚠️' : '✓';
        toast.innerHTML = `<span style="font-weight:bold; color: ${type==='error'?'#ff5555':'#ff8c00'};">${icon}</span> <span>${message}</span>`;
        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // Network status listener
    window.addEventListener('offline', () => {
        const b = document.getElementById('offline-banner');
        if (b) b.style.display = 'block';
    });
    window.addEventListener('online', () => {
        const b = document.getElementById('offline-banner');
        if (b) b.style.display = 'none';
        showToast(typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Network connection restored' : 'Подключение к сети восстановлено', 'success');
    });

    function copyToClipboard(text, successMessage) {
        const msg = successMessage || (typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Copied to clipboard!' : 'Скопировано в буфер обмена!');
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(msg);
            }).catch(() => {
                fallbackCopy(text, msg);
            });
        } else {
            fallbackCopy(text, msg);
        }
    }

    function fallbackCopy(text, msg) {
        const input = document.createElement('input');
        input.value = text;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.focus();
        input.select();
        try {
            document.execCommand('copy');
            showToast(msg);
        } catch(e) {
            showToast(typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Copy error' : 'Ошибка копирования', 'error');
        }
        document.body.removeChild(input);
    }

    let currentP2PRate = 0;
    let currentP2PType = 'buy';
    let currentP2PMaker = '';
    let currentP2PAsset = '';
    let currentP2PFiat = '';
    let currentP2PAdId = null;
    let currentP2PMinLimit = 0;
    let currentP2PMaxLimit = Infinity;
    
    function openP2PCalculator(adId, maker, rate, asset, fiat, action, minLimit, maxLimit) {
        currentP2PAdId = adId || null;
        currentP2PMinLimit = parseFloat(minLimit) || 0;
        currentP2PMaxLimit = parseFloat(maxLimit) || Infinity;
        currentP2PRate = parseFloat(rate) || 0;
        currentP2PMaker = maker || '';
        currentP2PAsset = asset || 'USDT';
        currentP2PFiat = fiat || 'RUB';

        document.getElementById('p2pCalcModal').classList.add('active');
        document.getElementById('p2p-calc-maker').innerText = maker;
        document.getElementById('p2p-calc-rate').innerText = Number(rate).toLocaleString('ru-RU') + ' ' + fiat;
        document.getElementById('p2p-calc-asset').innerText = asset;
        
        const limitsEl = document.getElementById('p2p-calc-limits-badge');
        if (limitsEl) {
            limitsEl.innerText = `Лимиты: ${currentP2PMinLimit.toLocaleString('ru-RU')} - ${currentP2PMaxLimit.toLocaleString('ru-RU')} ${fiat || '₽'}`;
        }
        const errBox = document.getElementById('p2p-calc-error');
        if (errBox) {
            errBox.style.display = 'none';
            errBox.innerText = '';
        }
        const submitBtn = document.getElementById('p2p-calc-submit-btn');
        if (submitBtn) submitBtn.disabled = false;

        // Poka-Yoke auto-resolution: Buy tab = taker buys, Sell tab = taker sells
        const activeTab = document.getElementById('btn-buy-tab')?.classList.contains('active') ? 'buy' : 'sell';
        let isBuy = true;
        if (action === 'sell' && activeTab === 'sell') {
            isBuy = false;
        } else if (action === 'buy' || activeTab === 'buy') {
            isBuy = true;
        } else {
            isBuy = (action !== 'sell');
        }
        
        document.getElementById('p2p-calc-action').innerText = isBuy ? 'Покупка' : 'Продажа';
        currentP2PType = isBuy ? 'buy' : 'sell';
        
        if (isBuy) {
            document.getElementById('p2p-calc-give-label').innerText = 'Я отдаю (' + fiat + ')';
            document.getElementById('p2p-calc-get-label').innerText = 'Я получу (' + asset + ')';
        } else {
            document.getElementById('p2p-calc-give-label').innerText = 'Я отдаю (' + asset + ')';
            document.getElementById('p2p-calc-get-label').innerText = 'Я получу (' + fiat + ')';
        }
        
        document.getElementById('p2p-calc-give').value = '';
        document.getElementById('p2p-calc-get').value = '';
    }

    function closeP2PCalculator() {
        document.getElementById('p2pCalcModal').classList.remove('active');
        currentP2PAdId = null;
    }

    function updateP2PCalc(inputType) {
        const giveInput = document.getElementById('p2p-calc-give');
        const getInput = document.getElementById('p2p-calc-get');
        const errBox = document.getElementById('p2p-calc-error');
        const submitBtn = document.getElementById('p2p-calc-submit-btn');
        const cryptoDecimals = (currentP2PAsset === 'BTC') ? 6 : ((currentP2PAsset === 'ETH') ? 5 : 2);
        
        let val = 0;
        if (inputType === 'give') {
            val = parseFloat(giveInput.value);
            if (!isNaN(val) && val >= 0 && currentP2PRate > 0) {
                if (currentP2PType === 'buy') {
                    getInput.value = (val / currentP2PRate).toFixed(cryptoDecimals);
                } else {
                    getInput.value = (val * currentP2PRate).toFixed(2);
                }
            } else {
                getInput.value = '';
            }
        } else {
            val = parseFloat(getInput.value);
            if (!isNaN(val) && val >= 0 && currentP2PRate > 0) {
                if (currentP2PType === 'buy') {
                    giveInput.value = (val * currentP2PRate).toFixed(2);
                } else {
                    giveInput.value = (val / currentP2PRate).toFixed(cryptoDecimals);
                }
            } else {
                giveInput.value = '';
            }
        }

        // Validate limits
        const fiatAmount = currentP2PType === 'buy' ? parseFloat(giveInput.value) : parseFloat(getInput.value);
        if (!isNaN(fiatAmount) && fiatAmount > 0) {
            if (fiatAmount < currentP2PMinLimit) {
                if (errBox) {
                    errBox.innerText = `Сумма ниже минимального лимита (${currentP2PMinLimit.toLocaleString('ru-RU')} ${currentP2PFiat})`;
                    errBox.style.display = 'block';
                }
                if (submitBtn) submitBtn.disabled = true;
            } else if (fiatAmount > currentP2PMaxLimit) {
                if (errBox) {
                    errBox.innerText = `Сумма превышает максимальный лимит (${currentP2PMaxLimit.toLocaleString('ru-RU')} ${currentP2PFiat})`;
                    errBox.style.display = 'block';
                }
                if (submitBtn) submitBtn.disabled = true;
            } else {
                if (errBox) errBox.style.display = 'none';
                if (submitBtn) submitBtn.disabled = false;
            }
        } else {
            if (errBox) errBox.style.display = 'none';
            if (submitBtn) submitBtn.disabled = false;
        }
    }

    let currentDealId = null;
    let p2pChatInterval = null;

    // Load dynamic P2P ads
    function loadDynamicP2PAds() {
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
                            if(pm === 'Сбербанк') pmClass = 'sber';
                            else if(pm === 'Т-Банк') pmClass = 'tbank';
                            else if(pm === 'СБП') pmClass = 'sbp';
                            else if(pm === 'Альфа-Банк') pmClass = 'alfa';
                            else if(pm === 'Райффайзенбанк') pmClass = 'raif';
                            else pmClass = 'sbp';
                            pmHtml += `<span class="bank-pill ${pmClass}">${escapeHtml(pm)}</span> `;
                        });
                    } catch(e) {}
                    
                    const isMakerSelling = (ad.type === 'sell');
                    const typeText = isMakerSelling ? 'Купить' : 'Продать';
                    
                    const card = document.createElement('div');
                    card.className = "p2p-bento-card dynamic-ad-card";
                    card.setAttribute("data-coin", ad.crypto);
                    
                    const percent = Math.min(100, Math.max(0, (ad.max_limit / (ad.available_amount * ad.price)) * 100)) || 50;
                    const safeName = escapeHtml(ad.username || 'Трейдер');
                    const initialChar = safeName.charAt(0).toUpperCase();

                    card.innerHTML = `
                        <div class="bento-card-top">
                            <div class="bento-avatar" style="background: rgba(255,255,255,0.05);">${initialChar}</div>
                            <div class="bento-merchant">
                                <div class="bento-name">${safeName}${ad.is_verified_trader ? '<span class="pro-badge">V</span>' : ''}</div>
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
                            <button class="${isMakerSelling ? 'bento-buy-btn' : 'bento-sell-btn'}" data-ad-id="${ad.id}">${typeText} ${ad.crypto}</button>
                        </div>
                    `;

                    // Poka-Yoke: safe event listener without string injection vulnerability
                    const actionBtn = card.querySelector('button');
                    if (actionBtn) {
                        actionBtn.onclick = () => {
                            openP2PCalculator(ad.id, ad.username, ad.price, ad.crypto, ad.fiat, isMakerSelling ? 'buy' : 'sell', ad.min_limit, ad.max_limit);
                        };
                    }
                    
                    const grid = isMakerSelling ? gridBuy : gridSell;
                    grid.insertBefore(card, grid.firstChild);
                });
                if(typeof filterP2POrders === 'function') filterP2POrders();
            })
            .catch(err => console.error("Error loading dynamic ads:", err));
    }
    
    document.addEventListener('DOMContentLoaded', loadDynamicP2PAds);

    function openP2PTrade() {
        const giveInput = document.getElementById('p2p-calc-give').value;
        const getInput = document.getElementById('p2p-calc-get').value;
        
        const parsedGive = parseFloat(giveInput);
        const parsedGet = parseFloat(getInput);

        if(!giveInput || !getInput || isNaN(parsedGive) || parsedGive <= 0 || isNaN(parsedGet) || parsedGet <= 0) {
            showToast(typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Please enter a valid amount' : 'Введите корректную сумму для обмена', 'error');
            return;
        }

        const fiatAmount = currentP2PType === 'buy' ? parsedGive : parsedGet;
        if (fiatAmount < currentP2PMinLimit || fiatAmount > currentP2PMaxLimit) {
            showToast(`Сумма должна быть в пределах от ${currentP2PMinLimit.toLocaleString('ru-RU')} до ${currentP2PMaxLimit.toLocaleString('ru-RU')} ${currentP2PFiat}`, 'error');
            return;
        }

        const btn = document.getElementById('p2p-calc-submit-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner"></span> Создание сделки...';
        }
        
        fetch('/api/p2p/deals', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                ad_id: currentP2PAdId,
                maker_name: currentP2PMaker,
                rate: currentP2PRate,
                asset: currentP2PAsset,
                fiat: currentP2PFiat,
                type: currentP2PType,
                amount_give: parsedGive,
                amount_get: parsedGet
            })
        }).then(r=>r.json()).then(data => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = 'Открыть сделку (Escrow)';
            }
            if(data.success) {
                closeP2PCalculator();
                openDealChat(data.deal_id, currentP2PMaker);
                showToast(typeof currentLang !== 'undefined' && currentLang === 'en' ? 'P2P Deal created!' : 'Сделка создана! Чат открыт', 'success');
            } else {
                showToast(data.error || (typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Authorization error' : 'Ошибка. Вы авторизованы?'), 'error');
                if (data.error && data.error.includes('авториз')) {
                    openAuthModal('login');
                }
            }
        }).catch(err => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = 'Открыть сделку (Escrow)';
            }
            showToast(typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Network error' : 'Ошибка сети при создании сделки', 'error');
        });
    }

    function openDealChat(dealId, makerName) {
        currentDealId = dealId;
        window.history.pushState(null, null, '#deal-' + dealId);
        
        document.getElementById('p2pChatModal').classList.add('active');
        document.getElementById('p2p-chat-maker').innerText = makerName;
        
        if (socket) {
            socket.emit('deal:join', dealId);
        }

        loadP2PDealDetails();
        loadP2PMessages();
        if(p2pChatInterval) clearInterval(p2pChatInterval);
        p2pChatInterval = setInterval(() => {
            loadP2PDealDetails();
            loadP2PMessages();
        }, 3000);
    }
    
    function closeDealChat() {
        window.history.pushState(null, null, '#p2p');
        if (socket && currentDealId) {
            socket.emit('deal:leave', currentDealId);
        }
        document.getElementById('p2pChatModal').classList.remove('active');
        if(p2pChatInterval) clearInterval(p2pChatInterval);
        currentDealId = null;
    }

    function updateEscrowUI(step) {
        document.getElementById('escrow-step-created').classList.remove('active');
        document.getElementById('escrow-step-paid').classList.remove('active');
        document.getElementById('escrow-step-released').classList.remove('active');
        
        // Reset styles
        ['created', 'paid', 'released'].forEach(s => {
            const el = document.getElementById('escrow-step-' + s);
            const circle = el.querySelector('.step-circle');
            const text = el.querySelector('div:last-child');
            circle.style.background = '#2a2e39';
            circle.style.color = 'var(--text-muted)';
            circle.style.borderColor = 'rgba(255,255,255,0.1)';
            circle.style.boxShadow = 'none';
            text.style.color = 'var(--text-muted)';
        });

        const steps = ['created', 'paid', 'released'];
        const currentIndex = steps.indexOf(step) !== -1 ? steps.indexOf(step) : 0;
        
        for(let i=0; i<=currentIndex; i++) {
            const el = document.getElementById('escrow-step-' + steps[i]);
            const circle = el.querySelector('.step-circle');
            const text = el.querySelector('div:last-child');
            
            if (i === currentIndex) {
                // Active step
                el.classList.add('active');
                circle.style.background = 'var(--accent-orange)';
                circle.style.color = '#000';
                circle.style.border = 'none';
                circle.style.boxShadow = '0 0 10px rgba(229,142,56,0.4)';
                text.style.color = '#fff';
            } else {
                // Passed step (Green)
                circle.style.background = 'rgba(46,189,133,0.15)';
                circle.style.color = 'var(--green)';
                circle.style.border = '1px solid rgba(46,189,133,0.4)';
                circle.innerHTML = '✓';
                circle.style.boxShadow = '0 0 8px rgba(46,189,133,0.3)';
                text.style.color = 'var(--green)';
            }
        }
    }

    function loadP2PDealDetails() {
        if(!currentDealId) return;
        fetch('/api/p2p/deals/' + currentDealId, { headers: getAuthHeaders() })
        .then(r=>r.json())
        .then(data => {
            if(data.error) return;
            document.getElementById('p2p-deal-amount').innerText = (data.amount_fiat || 0).toLocaleString('ru-RU') + ' RUB';
            // Check if user is Maker
            window.currentDealIsMaker = (data.maker_name === (currentUser ? currentUser.display_name || currentUser.username : ''));
            const container = document.getElementById('p2p-deal-reqs').parentElement.parentElement;
            
            
            const qr = document.getElementById('maker-quick-replies');
            if (qr) qr.style.display = 'none';

// Requisites injection
            if (!window.currentDealIsMaker) {
                document.getElementById('p2p-deal-reqs').innerHTML = '<span style="color:var(--green);font-weight:bold;">Отправьте средства на единый Escrow-счет Платформы:</span><br/>Банк: Т-Банк<br/>Карта: 2202 20** **** 1234<br/>Получатель: MAO Garant';
            } else {
                document.getElementById('p2p-deal-reqs').innerHTML = '<span style="color:var(--text-muted);">Вы Мейкер. Ожидайте поступления средств от Гаранта на ваши реквизиты.</span>';
            }
            
            // Buttons logic
            let btnPaid = document.getElementById('btn-p2p-paid');
            if (window.currentDealIsMaker) {
                btnPaid.disabled = true;
                btnPaid.style.background = 'rgba(255,255,255,0.05)';
                btnPaid.style.color = 'var(--text-muted)';
                if (data.status === 'open') {
                    btnPaid.innerText = 'Ожидаем оплату тейкера на Escrow...';
                } else if (data.status === 'paid') {
                    btnPaid.innerText = '⏳ Гарант проверяет перевод...';
                } else if (data.status === 'completed') {
                    btnPaid.innerText = '✓ Гарант распределил активы';
                }
            } else {
                if (data.status === 'open') {
                    btnPaid.disabled = false;
                    btnPaid.innerText = '✓ Я оплатил Гаранту';
                    btnPaid.onclick = markP2PDealPaid;
                } else if (data.status === 'paid') {
                    btnPaid.disabled = true;
                    btnPaid.innerText = '⏳ Проверка Гарантом...';
                } else if (data.status === 'completed') {
                    btnPaid.disabled = true;
                    btnPaid.innerText = '✓ Крипта получена от Гаранта';
                }
            }
            
            // Add Escrow Banner if not exists
            if (!document.getElementById('escrow-locked-banner')) {
                const banner = document.createElement('div');
                banner.id = 'escrow-locked-banner';
                banner.style.cssText = 'background: rgba(46,189,133,0.1); border: 1px solid rgba(46,189,133,0.3); border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 12px; color: var(--green); display: flex; align-items: center; gap: 10px;';
                banner.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> <span><b>Централизованный Гарант:</b> Фиат и Крипта проходят через администратора. Безопасность 100%.</span>';
                const container = document.getElementById('p2p-deal-reqs').parentElement.parentElement;
                container.insertBefore(banner, container.firstChild);
            }
            
            // Timer reset logic
            if (data.status === 'open') {
                const diff = Math.floor((Date.now() - new Date(data.created_at).getTime()) / 1000);
                dealTimerSeconds = Math.max(0, 900 - diff);
                if (!activeDealInterval) activeDealInterval = setInterval(updateDealTimer, 1000);
            } else {
                if (activeDealInterval) clearInterval(activeDealInterval);
                document.getElementById('p2p-deal-timer').innerText = 'В руках Гаранта';
                document.getElementById('p2p-deal-timer').style.color = 'var(--text-muted)';
            }
            
            updateEscrowUI(data.escrow_step || 'created');
        });
    }

    function loadP2PMessages() {
        if(!currentDealId) return;
        fetch('/api/p2p/deals/' + currentDealId + '/messages', { headers: getAuthHeaders() })
        .then(r=>r.json())
        .then(data => {
            if(data.error) return;
            const container = document.getElementById('p2p-chat-messages');
            if (!container) return;
            
            // Play sound only if new messages arrive after initial load
            if (container.children.length > 0 && data.length > container.children.length) {
                const lastMsg = data[data.length - 1];
                if(typeof playBeep !== 'undefined') {
                    if(lastMsg.message.includes('Оплата подтверждена') || lastMsg.message.includes('диспут') || lastMsg.message.includes('ВНИМАНИЕ')) {
                        playBeep('alert');
                    } else {
                        playBeep('chat');
                    }
                }
            }

            container.innerHTML = '';
            data.forEach(msg => {
            const isMine = (msg.sender_type === 'taker' && !window.currentDealIsMaker) || (msg.sender_type === 'maker' && window.currentDealIsMaker);

                const isAdmin = msg.sender_type === 'admin' || msg.sender_type === 'system';
                const div = document.createElement('div');
                if (isAdmin) {
                    div.className = 'chat-message system-admin';
                    div.style.cssText = 'background: rgba(229,142,56,0.12); border: 1px solid rgba(229,142,56,0.35); color: var(--accent-orange); align-self: center; text-align: center; border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600; width: 90%; margin: 6px auto;';
                } else {
                    div.className = 'chat-message ' + (isMine ? 'mine' : 'theirs');
                }
                div.innerText = msg.message;
                container.appendChild(div);
            });
            container.scrollTop = container.scrollHeight;
        });
    }
    
    
    async function uploadP2PFile() {
        const fileInput = document.getElementById('p2p-chat-file');
        if (!fileInput.files || fileInput.files.length === 0) return;
        const file = fileInput.files[0];
        
        const formData = new FormData();
        formData.append('receipt', file);
        
        showToast('Загрузка файла...', 'info');
        try {
            const res = await fetch('/api/p2p/deals/' + currentDealId + '/upload', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') },
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                fileInput.value = ''; // clear
            } else {
                showToast(data.error || 'Ошибка загрузки', 'error');
            }
        } catch(e) {
            showToast('Ошибка сети', 'error');
        }
    }

    function sendP2PMessage() {
        if(!currentDealId) return;
        const input = document.getElementById('p2p-chat-input');
        const text = input.value.trim();
        if(!text) return;
        
        fetch('/api/p2p/deals/' + currentDealId + '/messages', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ message: text })
        }).then(r=>r.json()).then(data => {
            if(data.success) {
                input.value = '';
                loadP2PMessages();
            }
        });
    }

    async function markP2PDealPaid() {
        if(!currentDealId) return;
        const btn = document.getElementById('btn-p2p-paid');
        if(btn) {
            btn.disabled = true;
            btn.innerText = 'Фиксация оплаты...';
        }
        try {
            const res = await fetch('/api/p2p/deals/' + currentDealId + '/paid', {
                method: 'POST',
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (res.ok && data.success) {
                showToast('✓ Оплата подтверждена! Продавцу отправлено уведомление.', 'success');
                if (btn) {
                    btn.innerText = '✓ Оплачено (проверяется)';
                    btn.style.opacity = '0.7';
                }
                loadP2PMessages();
            } else {
                showToast(data.error || 'Ошибка подтверждения оплаты', 'error');
                if (btn) {
                    btn.disabled = false;
                    btn.innerText = '✓ Я оплатил';
                }
            }
        } catch(e) {
            showToast('Ошибка сети при фиксации оплаты', 'error');
            if (btn) {
                btn.disabled = false;
                btn.innerText = '✓ Я оплатил';
            }
        }
    }

    async function appealP2PDeal() {
        if(!currentDealId) return;
        const btn = document.getElementById('btn-p2p-appeal');
        if(btn) {
            btn.disabled = true;
            btn.innerText = 'Подключение арбитра...';
        }
        try {
            const res = await fetch('/api/p2p/deals/' + currentDealId + '/dispute', {
                method: 'POST',
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (res.ok && data.success) {
                showToast('🚨 Апелляция открыта! Арбитр безопасности подключился к сделке.', 'success');
                loadP2PMessages();
            } else {
                showToast(data.error || 'Ошибка вызова арбитража', 'error');
            }
        } catch(e) {
            showToast('Ошибка сети при вызове арбитража', 'error');
        } finally {
            if(btn) {
                btn.disabled = false;
                btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> Апелляция';
            }
        }
    }

    async function cancelP2PDeal() {
        if(!currentDealId) return;
        try {
            const res = await fetch('/api/p2p/deals/' + currentDealId + '/cancel', {
                method: 'POST',
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (res.ok && data.success) {
                showToast('Сделка отменена. Резерв Escrow расформирован.', 'error');
                closeDealChat();
            } else {
                showToast(data.error || 'Ошибка отмены сделки', 'error');
            }
        } catch(e) {
            showToast('Ошибка сети при отмене сделки', 'error');
        }
    }

    
function openEscrowModal() {
    document.getElementById('escrowModal').style.display = 'flex';
}
function closeEscrowModal() {
    document.getElementById('escrowModal').style.display = 'none';
}

function openMakerVerificationModal() {
        fetch('/api/auth/me').then(r=>r.json()).then(data => {
            if (data.authenticated) {
                const user = data.user;
                if (user.email && user.telegram_id && user.phone) {
                    // Fully verified
                    setStepSuccess('email');
                    setStepSuccess('tg');
                    setStepSuccess('phone');
                    openCreateAdModal();
                } else {
                    // Missing some verification
                    if (user.email) setStepSuccess('email');
                    if (user.telegram_id) setStepSuccess('tg');
                    if (user.phone) {
                        setStepSuccess('phone');
                        document.getElementById('btn-create-ad-final').style.display = 'block';
                    }
                    document.getElementById('makerVerificationModal').classList.add('active');
                }
            } else {
                showToast(typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Please log in to your account' : 'Пожалуйста, войдите в аккаунт для создания объявления', 'error');
                openAuthModal();
            }
        }).catch(err => {
            document.getElementById('makerVerificationModal').classList.add('active');
        });
    }
    
    function closeMakerVerificationModal() {
        document.getElementById('makerVerificationModal').classList.remove('active');
    }
    
    function openCreateAdModal() {
        closeMakerVerificationModal();
        document.getElementById('createAdModal').classList.add('active');
    }



    function setStepSuccess(step) {
        let idMap = { 'email': 1, 'tg': 2, 'phone': 3 };
        let num = idMap[step];
        const icon = document.getElementById('maker-icon-' + num);
        if(icon) {
            icon.innerText = '✅';
            icon.style.color = 'var(--green)';
        }
        let btn = document.getElementById('btn-verify-' + step);
        if (btn) {
            btn.innerText = 'Подтверждено';
            btn.style.borderColor = 'var(--green)';
            btn.style.color = 'var(--green)';
            btn.disabled = true;
        }
    }

    function verifyMakerStep(step) {
        if (step === 'tg') {
            showToast(typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Link your Telegram in profile first' : 'Сначала авторизуйтесь или привяжите Telegram в профиле', 'error');
        } else if (step === 'phone') {
            window.open('https://t.me/MAO_auth_bot?start=phone_verify', '_blank');
        }
    }

    function startMakerEmailVerify() {
        document.getElementById('maker-email-form').style.display = 'block';
        document.getElementById('btn-verify-email').style.display = 'none';
        document.getElementById('maker-email-input').focus();
    }

    let makerVerificationEmail = '';
    
    function sendMakerEmailCode() {
        const email = document.getElementById('maker-email-input').value.trim();
        const errorEl = document.getElementById('maker-email-error');
        
        if (!email || !email.includes('@')) {
            errorEl.innerText = 'Введите корректный email';
            errorEl.style.display = 'block';
            return;
        }
        
        errorEl.style.display = 'none';
        makerVerificationEmail = email;
        
        if (typeof socket !== 'undefined' && socket) {
            socket.emit('maker:send_email_code', { email: email });
        } else {
            errorEl.innerText = 'Нет подключения к серверу';
            errorEl.style.display = 'block';
        }
    }
    
    function confirmMakerEmail() {
        const code = document.getElementById('maker-email-code').value.trim();
        const errorEl = document.getElementById('maker-code-error');
        
        if (!code || code.length < 4) {
            errorEl.innerText = 'Введите код из письма';
            errorEl.style.display = 'block';
            return;
        }
        
        errorEl.style.display = 'none';
        
        if (typeof socket !== 'undefined' && socket) {
            socket.emit('maker:verify_email_code', { email: makerVerificationEmail, code: code });
        }
    }
