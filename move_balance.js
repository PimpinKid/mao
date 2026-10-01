const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// 1. Remove the standalone row
const standaloneBlockRegex = /<!-- RUB Balance -->[\s\S]*?<div style="font-size: 18px; font-weight: 900; font-family: monospace; color: var\(--green\);"><span id="modal-balance-rub">0\.00<\/span> RUB<\/div>\s*<\/div>/;
content = content.replace(standaloneBlockRegex, '');

// 2. Inject into the modal header
const modalHeaderRegex = /(<div style="font-size: 12px; color: var\(--text-muted\); margin-top: 4px;">ID: <span id="modal-user-id">00000<\/span> \| <span id="modal-user-email">email@example\.com<\/span><\/div>\s*<\/div>)/;

const injectedBalance = `$1
                    <div style="text-align: right; background: var(--bg-hover); padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color);">
                        <div style="font-size: 9px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Ваш баланс</div>
                        <div style="font-size: 15px; font-weight: 900; font-family: monospace; color: var(--green);"><span id="modal-balance-rub">0.00</span> RUB</div>
                    </div>`;

content = content.replace(modalHeaderRegex, injectedBalance);

fs.writeFileSync('index.html', content);
