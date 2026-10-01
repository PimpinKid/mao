const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const customAlertsHTML = `
    <!-- Custom MAO Alert/Confirm Modals -->
    <div id="mao-alert-overlay" class="modal-overlay" style="z-index: 10005; align-items: center; justify-content: center;">
        <div class="modal-box" style="max-width: 360px; padding: 24px; background: #14100d; border: 1px solid var(--accent-orange); border-radius: 12px; box-shadow: 0 0 40px rgba(229,142,56,0.15); text-align: center;">
            <div style="font-size: 32px; color: var(--accent-orange); margin-bottom: 15px;">
                <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <div id="mao-alert-msg" style="color: #fff; font-size: 14px; font-weight: 600; margin-bottom: 24px; line-height: 1.5; word-wrap: break-word;"></div>
            <button id="mao-alert-btn" onclick="document.getElementById('mao-alert-overlay').classList.remove('active')" class="btn-outline" style="width: 100%; background: var(--accent-orange); color: #14100d; border: none; font-weight: 900; padding: 12px; font-size: 14px; border-radius: 6px; cursor: pointer; transition: 0.2s;">ПОНЯТНО</button>
        </div>
    </div>

    <div id="mao-confirm-overlay" class="modal-overlay" style="z-index: 10005; align-items: center; justify-content: center;">
        <div class="modal-box" style="max-width: 360px; padding: 24px; background: #14100d; border: 1px solid var(--accent-orange); border-radius: 12px; box-shadow: 0 0 40px rgba(229,142,56,0.15); text-align: center;">
            <div style="font-size: 32px; color: var(--accent-orange); margin-bottom: 15px;">
                <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <div id="mao-confirm-msg" style="color: #fff; font-size: 14px; font-weight: 600; margin-bottom: 24px; line-height: 1.5; word-wrap: break-word;"></div>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="mao-confirm-cancel" class="btn-outline" style="flex: 1; background: transparent; color: var(--text-muted); border: 1px solid var(--border-color); font-weight: 700; padding: 12px; font-size: 13px; border-radius: 6px; cursor: pointer;">ОТМЕНА</button>
                <button id="mao-confirm-ok" class="btn-outline" style="flex: 1; background: var(--accent-orange); color: #14100d; border: none; font-weight: 900; padding: 12px; font-size: 13px; border-radius: 6px; cursor: pointer;">ПОДТВЕРДИТЬ</button>
            </div>
        </div>
    </div>
    
    <script>
        // Override native alert globally
        window.alert = function(msg) {
            document.getElementById('mao-alert-msg').innerText = msg;
            document.getElementById('mao-alert-overlay').classList.add('active');
        };

        // Async confirm replacement
        window.maoConfirm = function(msg) {
            return new Promise((resolve) => {
                document.getElementById('mao-confirm-msg').innerText = msg;
                const overlay = document.getElementById('mao-confirm-overlay');
                overlay.classList.add('active');
                
                document.getElementById('mao-confirm-ok').onclick = function() {
                    overlay.classList.remove('active');
                    resolve(true);
                };
                document.getElementById('mao-confirm-cancel').onclick = function() {
                    overlay.classList.remove('active');
                    resolve(false);
                };
            });
        };
    </script>
`;

content = content.replace('</body>', customAlertsHTML + '\n</body>');

// Now replace confirm() usages with await maoConfirm()
// There are two of them:
// 1. deleteAd(id)
const oldDeleteAd = `function deleteAd(id) {
    if(!confirm('Удалить объявление навсегда?')) return;`;
const newDeleteAd = `async function deleteAd(id) {
    if(!(await window.maoConfirm('Удалить объявление навсегда?'))) return;`;
content = content.replace(oldDeleteAd, newDeleteAd);

// 2. disconnectWeb3Wallet()
const oldDisconnect = `window.disconnectWeb3Wallet = async function() {
        if (!confirm('Вы уверены, что хотите отвязать Web3 кошелек от аккаунта?')) return;`;
const newDisconnect = `window.disconnectWeb3Wallet = async function() {
        if (!(await window.maoConfirm('Вы уверены, что хотите отвязать Web3 кошелек от аккаунта?'))) return;`;
content = content.replace(oldDisconnect, newDisconnect);

fs.writeFileSync('index.html', content);
