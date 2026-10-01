

    function switchTab(tabName) {
        localStorage.setItem('activeTab', tabName);
        
        // Update URL hash
        if (window.location.hash !== '#' + tabName) {
            window.history.replaceState(null, null, '#' + tabName);
        }

        const mainTab = document.getElementById('main-tab-content');
        const p2pTab = document.getElementById('p2p-tab-content');

        // Сброс класса для перезапуска анимации
        mainTab.classList.remove('tab-animate-enter');
        p2pTab.classList.remove('tab-animate-enter');

        if (tabName === 'main') {
            mainTab.style.display = 'block';
            p2pTab.style.display = 'none';
            document.querySelector('.header-center-nav a:nth-child(1)').classList.add('active');
            document.querySelector('.header-center-nav a:nth-child(2)').classList.remove('active');
            
            // DOM reflow и запуск анимации
            void mainTab.offsetWidth;
            mainTab.classList.add('tab-animate-enter');
        } else if (tabName === 'p2p') {
            mainTab.style.display = 'none';
            p2pTab.style.display = 'block';
            document.querySelector('.header-center-nav a:nth-child(1)').classList.remove('active');
            document.querySelector('.header-center-nav a:nth-child(2)').classList.add('active');
            
            // DOM reflow и запуск анимации
            void p2pTab.offsetWidth;
            p2pTab.classList.add('tab-animate-enter');
        }
    }

    // Handle initial load and back/forward navigation
    window.addEventListener('hashchange', () => {
        let hash = window.location.hash.replace('#', '');
        if (hash === 'main' || hash === 'p2p') {
            switchTab(hash);
        }
    });


    

    
        // Sticky Header Effect (Desktop)
    let headerScrolledState = false;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (!header) return;
        if (window.scrollY > 60 && !headerScrolledState) {
            header.classList.add('scrolled');
            headerScrolledState = true;
        } else if (window.scrollY < 15 && headerScrolledState) {
            header.classList.remove('scrolled');
            headerScrolledState = false;
        }
    });

    // Custom Select Initialization
    function initCustomSelects() {
        document.querySelectorAll('select').forEach(select => {
            if (select.nextElementSibling && select.nextElementSibling.classList.contains('custom-select-wrapper')) return;
            
            const wrapper = document.createElement('div');
            wrapper.className = 'custom-select-wrapper';
            
            // Extract width from inline styles or classes
            if (select.style.width) {
                wrapper.style.width = select.style.width;
                select.style.width = '100%'; // Make trigger fill wrapper
            } else if (select.classList.contains('p2p-select')) {
                wrapper.style.width = '100%';
            }

            const trigger = document.createElement('div');
            trigger.className = 'custom-select-trigger';
            // copy classes and styles
            if (select.className) trigger.className += ' ' + select.className;
            if (select.style.cssText) trigger.style.cssText = select.style.cssText;
            
            select.style.display = 'none';
            
            const textSpan = document.createElement('span');
            textSpan.className = 'custom-select-text';
            textSpan.innerText = select.options[select.selectedIndex]?.text || '';
            
            const arrow = document.createElement('div');
            arrow.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.5; transition: transform 0.2s;" class="custom-select-arrow"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
            
            trigger.appendChild(textSpan);
            trigger.appendChild(arrow);
            
            const dropdown = document.createElement('div');
            dropdown.className = 'custom-select-dropdown';
            
            Array.from(select.options).forEach((option, index) => {
                const item = document.createElement('div');
                item.className = 'custom-select-item';
                if (index === select.selectedIndex) item.classList.add('selected');
                
                item.innerHTML = `<span class="check-mark">${index === select.selectedIndex ? '✓' : ''}</span><span class="item-text">${option.text}</span>`;
                
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    select.selectedIndex = index;
                    textSpan.innerText = option.text;
                    
                    dropdown.querySelectorAll('.custom-select-item').forEach(el => {
                        el.classList.remove('selected');
                        el.querySelector('.check-mark').innerText = '';
                    });
                    item.classList.add('selected');
                    item.querySelector('.check-mark').innerText = '✓';
                    
                    dropdown.classList.remove('active');
                    trigger.querySelector('.custom-select-arrow').style.transform = 'rotate(0deg)';
                    select.dispatchEvent(new Event('change'));
                });
                dropdown.appendChild(item);
            });
            
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isActive = dropdown.classList.contains('active');
                
                document.querySelectorAll('.custom-select-dropdown').forEach(d => {
                    d.classList.remove('active');
                    const arr = d.previousElementSibling.querySelector('.custom-select-arrow');
                    if(arr) arr.style.transform = 'rotate(0deg)';
                });
                
                if (!isActive) {
                    dropdown.classList.add('active');
                    trigger.querySelector('.custom-select-arrow').style.transform = 'rotate(180deg)';
                }
            });
            
            wrapper.appendChild(trigger);
            wrapper.appendChild(dropdown);
            select.parentNode.insertBefore(wrapper, select.nextSibling);
        });
        
        document.addEventListener('click', () => {
            document.querySelectorAll('.custom-select-dropdown').forEach(d => {
                d.classList.remove('active');
                const arr = d.previousElementSibling.querySelector('.custom-select-arrow');
                if(arr) arr.style.transform = 'rotate(0deg)';
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initCustomSelects();
        let hash = window.location.hash.replace('#', '');
        
        let dealToOpen = null;
        if (hash.startsWith('deal-')) {
            dealToOpen = hash.split('-')[1];
            hash = 'p2p';
        }

        if (!hash || (hash !== 'main' && hash !== 'p2p')) {
            hash = localStorage.getItem('activeTab') || 'main';
        }
        switchTab(hash);
        loadLiveReserves();

        if (dealToOpen) {
            setTimeout(() => {
                openDealChat(dealToOpen, 'Загрузка...');
            }, 500); // Give it half a second for Auth to init if logged in
        }

        // WebSockets Resiliency: Reconnect Sync
        if (typeof socket !== 'undefined' && socket) {
            socket.on('reconnect', () => {
                if (currentDealId) {
                    socket.emit('deal:join', currentDealId);
                    loadP2PDealDetails();
                    loadP2PMessages();
                }
            });
        }
    });

    async function loadLiveReserves() {
        try {
            const res = await fetch('/api/reserves');
            if (res.ok) {
                const data = await res.json();
                updateLiveReservesUI(data);
            }
        } catch(e) {}
    }

    function updateLiveReservesUI(reserves) {
        if (!reserves) return;
        const usdtEl = document.getElementById('reserve-val-USDTTRC');
        const btcEl = document.getElementById('reserve-val-BTC');
        const ethEl = document.getElementById('reserve-val-ETH');
        const rubEl = document.getElementById('reserve-val-RUB');

        if (usdtEl && reserves.USDTTRC !== undefined) {
            usdtEl.innerText = `${Number(reserves.USDTTRC).toLocaleString('en-US')} USDT`;
        }
        if (btcEl && reserves.BTC !== undefined) {
            btcEl.innerText = `${Number(reserves.BTC).toLocaleString('en-US', { maximumFractionDigits: 4 })} BTC`;
        }
        if (ethEl && reserves.ETH !== undefined) {
            ethEl.innerText = `${Number(reserves.ETH).toLocaleString('en-US', { maximumFractionDigits: 4 })} ETH`;
        }
        if (rubEl && reserves.RUB !== undefined) {
            rubEl.innerText = `${Number(reserves.RUB).toLocaleString('ru-RU')} ₽`;
        }
    }

    function openRulesModal() {
        const r = document.getElementById('rulesModal');
        if (r) r.classList.add('active');
    }
    function closeRulesModal() {
        const r = document.getElementById("rulesModal");
        if (r) r.classList.remove("active");
    }
