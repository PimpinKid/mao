const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regexToReplace = /(<div style="font-size: 12px; color: var\(--text-muted\); margin-top: 4px;">ID: <span id="profile-modal-id">\.\.\.<\/span> \| <span id="profile-modal-email">\.\.\.<\/span><\/div>\s*<\/div>\s*)(<\/div>)/;

const newHeader = `$1
                <div style="text-align: right; display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Баланс (RUB)</div>
                    <div style="font-size: 16px; font-weight: 900; font-family: monospace; color: var(--green);"><span id="modal-balance-rub">0.00</span> ₽</div>
                </div>
            $2`;

content = content.replace(regexToReplace, newHeader);

// And ensure the standalone block is removed if it's there
const standaloneBlockRegex = /<!-- RUB Balance -->[\s\S]*?<div style="font-size: 18px; font-weight: 900; font-family: monospace; color: var\(--green\);"><span id="modal-balance-rub">0\.00<\/span> RUB<\/div>\s*<\/div>/;
content = content.replace(standaloneBlockRegex, '');

fs.writeFileSync('index.html', content);
