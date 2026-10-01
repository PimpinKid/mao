const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Fix Empty state in renderActivityTable
code = code.replace(/tbody\.innerHTML = '';/, `tbody.innerHTML = '';\n        if (!trades || trades.length === 0) {\n            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--text-muted); padding: 20px;">' + (currentLang === 'en' ? 'No recent activity' : 'Нет недавней активности') + '</td></tr>';\n            return;\n        }`);

// 2. Fix submitP2PAd spinner
code = code.replace(/btn\.innerText = 'Отправка\.\.\.';/, `btn.innerHTML = '<span class="spinner" style="border-width: 2px; width: 14px; height: 14px; margin-right: 8px;"></span> Отправка...';`);

// 3. Fix negative limits in submitP2PAd
code = code.replace(/if\(!price \|\| !min_limit \|\| !max_limit \|\| !available_amount\)/, `if(!price || !min_limit || !max_limit || !available_amount || parseFloat(price) <= 0 || parseFloat(min_limit) <= 0 || parseFloat(max_limit) <= 0 || parseFloat(available_amount) <= 0)`);

// 4. Fix negative amountGet in createOrder
code = code.replace(/if\(isNaN\(amountGive\) \|\| amountGive <= 0\)/, `const amountGet = parseFloat(document.getElementById('order-amount-crypto').value);\n        if(isNaN(amountGive) || amountGive <= 0 || isNaN(amountGet) || amountGet <= 0)`);

fs.writeFileSync('index.html', code);
console.log('UI/UX and Validations patched');
