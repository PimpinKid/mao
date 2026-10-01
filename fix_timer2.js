const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regex = /\/\/ Simple rate timer countdown visual[\s\S]*?\}, 1000\);/;

const replacement = `
                    // The timer logic is now managed globally by window.resetRateTimer()
`;

content = content.replace(regex, replacement);

const globalTimerLogic = `
    // --- RATE TIMER LOGIC ---
    window.rateTimerInterval = null;
    window.exchangeTimeLeft = 900; // 15 mins

    window.resetRateTimer = function() {
        if (window.rateTimerInterval) clearInterval(window.rateTimerInterval);
        window.exchangeTimeLeft = 900;
        
        const rateBox = document.getElementById('rate-safety-box');
        if (rateBox) {
            rateBox.style.background = 'rgba(46, 189, 133, 0.05)';
            rateBox.style.border = '1px solid rgba(46, 189, 133, 0.2)';
            rateBox.innerHTML = \`
                <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(46, 189, 133, 0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div>
                    <div style="font-size: 12px; color: var(--green); font-weight: 700;">Курс зафиксирован на <span id="rate-timer-display">15:00</span></div>
                    <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">При форс-мажоре гарантируем полный возврат (Escrow).</div>
                </div>
            \`;
        }

        window.rateTimerInterval = setInterval(() => {
            if (window.exchangeTimeLeft > 0) {
                window.exchangeTimeLeft--;
                const m = Math.floor(window.exchangeTimeLeft / 60);
                const s = window.exchangeTimeLeft % 60;
                const el = document.getElementById('rate-timer-display');
                if (el) el.textContent = \`\${m}:\${s.toString().padStart(2, '0')}\`;
            } else {
                clearInterval(window.rateTimerInterval);
                const rBox = document.getElementById('rate-safety-box');
                if (rBox) {
                    rBox.style.background = 'rgba(229, 142, 56, 0.05)';
                    rBox.style.border = '1px solid rgba(229, 142, 56, 0.4)';
                    rBox.innerHTML = \`
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(229, 142, 56, 0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: var(--accent-orange); font-weight: 700;">Внимание, курс мог обновиться</div>
                            <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Время фиксации истекло. Возможен перерасчет по рынку.</div>
                        </div>
                    \`;
                }
            }
        }, 1000);
    };

    // Initialize timer on load
    document.addEventListener('DOMContentLoaded', () => {
        window.resetRateTimer();
    });
`;

content = content.replace('// Initialization', globalTimerLogic + '\n    // Initialization');

// Inject the ID into rate-safety-box
content = content.replace(
    '<div class="rate-safety-box" style="background: rgba(46, 189, 133, 0.05);',
    '<div id="rate-safety-box" class="rate-safety-box" style="background: rgba(46, 189, 133, 0.05);'
);

// Call resetRateTimer when token changes
content = content.replace(
    /function selectActiveAsset\(type, coin, displayName, rateUSD\) \{/,
    'function selectActiveAsset(type, coin, displayName, rateUSD) {\n        if (window.resetRateTimer) window.resetRateTimer();'
);

// Also reset timer when the middle swap button is pressed
content = content.replace(
    /function swapAssets\(\) \{/,
    'function swapAssets() {\n        if (window.resetRateTimer) window.resetRateTimer();'
);

fs.writeFileSync('index.html', content);
