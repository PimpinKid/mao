const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const headerRight = '<div class="header-right" style="display:flex; align-items:center; gap:12px;">';
const balanceHTML = `
                <!-- BALANCE DISPLAY -->
                <div id="header-balance-display" style="display: none; background: var(--card-bg); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 6px; font-family: monospace; font-size: 13px; font-weight: bold; color: #fff; align-items: center; gap: 6px;">
                    <span id="header-balance-rub" style="color: var(--green);">0.00</span> RUB
                </div>`;

content = content.replace(headerRight, headerRight + balanceHTML);

// Inside the account modal (#accountModal)
// Let's find the Web3 Connection section inside the account modal
const web3ConnSection = '<!-- Web3 Connection -->';
const accountBalanceHTML = `
            <!-- RUB Balance -->
            <div style="margin-bottom: 20px; background: var(--bg-hover); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Баланс аккаунта</div>
                <div style="font-size: 18px; font-weight: 900; font-family: monospace; color: var(--green);"><span id="modal-balance-rub">0.00</span> RUB</div>
            </div>
`;

content = content.replace(web3ConnSection, accountBalanceHTML + '\n            ' + web3ConnSection);

fs.writeFileSync('index.html', content);
