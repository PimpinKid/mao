const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. REVERT USDT LOGOS
const sbpBeautifulSvg = "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 36 40%22><defs><linearGradient id=%22gradL%22 x1=%220%%22 y1=%220%%22 x2=%220%%22 y2=%22100%%22><stop offset=%220%%22 stop-color=%22%233b82f6%22/><stop offset=%22100%%22 stop-color=%22%238b5cf6%22/></linearGradient><linearGradient id=%22gradT%22 x1=%220%%22 y1=%220%%22 x2=%220%%22 y2=%22100%%22><stop offset=%220%%22 stop-color=%22%23facc15%22/><stop offset=%22100%%22 stop-color=%22%23ef4444%22/></linearGradient><linearGradient id=%22gradB%22 x1=%220%%22 y1=%220%%22 x2=%220%%22 y2=%22100%%22><stop offset=%220%%22 stop-color=%22%234ade80%22/><stop offset=%22100%%22 stop-color=%22%23059669%22/></linearGradient></defs><path d=%22M4 11 V 29 L 18 20 Z%22 fill=%22url(%23gradL)%22/><path d=%22M32 1 V 19 L 18 10 Z%22 fill=%22url(%23gradT)%22/><path d=%22M32 21 V 39 L 18 30 Z%22 fill=%22url(%23gradB)%22/></svg>";
code = code.split(sbpBeautifulSvg).join('https://cryptologos.cc/logos/tether-usdt-logo.svg?v=032');

// Just in case I used v=024 anywhere
code = code.replace(/<img src="https:\/\/cryptologos\.cc\/logos\/tether-usdt-logo\.svg\?v=032" class="f-coin usdt">/g, '<img src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=024" class="f-coin usdt">');

// 2. FIX SBP ICON TO WHITE CIRCLE BACKGROUND
const newSbpIcon = "data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27><circle cx=%2750%27 cy=%2750%27 r=%2750%27 fill=%27%23ffffff%27/><defs><linearGradient id=%27gradL%27 x1=%270%%27 y1=%270%%27 x2=%270%%27 y2=%27100%%27><stop offset=%270%%27 stop-color=%27%233b82f6%27/><stop offset=%27100%%27 stop-color=%27%238b5cf6%27/></linearGradient><linearGradient id=%27gradT%27 x1=%270%%27 y1=%270%%27 x2=%270%%27 y2=%27100%%27><stop offset=%270%%27 stop-color=%27%23facc15%27/><stop offset=%27100%%27 stop-color=%27%23ef4444%27/></linearGradient><linearGradient id=%27gradB%27 x1=%270%%27 y1=%270%%27 x2=%270%%27 y2=%27100%%27><stop offset=%270%%27 stop-color=%27%234ade80%27/><stop offset=%27100%%27 stop-color=%27%23059669%27/></linearGradient></defs><g transform=%27translate(14, 14) scale(1.8)%27><path d=%27M4 11 V 29 L 18 20 Z%27 fill=%27url(%23gradL)%27/><path d=%27M32 1 V 19 L 18 10 Z%27 fill=%27url(%23gradT)%27/><path d=%27M32 21 V 39 L 18 30 Z%27 fill=%27url(%23gradB)%27/></g></svg>";
code = code.replace(/const sbpIcon = "\/sbp_logo\.png";/g, 'const sbpIcon = "' + newSbpIcon + '";');

// 3. REVERT PARTNERS BAR
const brokenPartners = /<div class="partners-bar" style="margin-top: 0; justify-content: center; width: 100%; display: flex; gap: 30px; opacity: 0\.5; filter: grayscale\(100%\);">[\s\S]*?<\/div>/;
const originalPartners = `<div class="partners-bar" style="margin-top: 0; justify-content: center; width: 100%;">
                <span>BestChange</span>
                <span>РБК</span>
                <span>ExchangeSumo</span>
                <span>Bits.media</span>
            </div>`;
code = code.replace(brokenPartners, originalPartners);

// 4. FIX ACTIVITY FEED NOT INITIALIZING & ADD TIMER
const onloadRegex = /window\.onload = async \(\) => \{[\s\S]*?\}\;/;
const newOnload = `window.onload = async () => {
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
        if(typeof populateInitialActivity === 'function') populateInitialActivity();
        if(typeof scheduleActivity === 'function') scheduleActivity();
        
        // Timer Logic
        let timerSeconds = 15 * 60;
        setInterval(() => {
            if (timerSeconds > 0) timerSeconds--;
            let m = Math.floor(timerSeconds / 60);
            let s = timerSeconds % 60;
            const timerEl = document.getElementById('rate-timer-display');
            if(timerEl) {
                timerEl.innerText = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
            }
        }, 1000);
    };`;
code = code.replace(onloadRegex, newOnload);

fs.writeFileSync('index.html', code);
console.log('Fixed everything');
