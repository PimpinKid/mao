const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /function renderActivityTable\(trades\) \{[\s\S]*?function filterTree\(type, category, tabElement\) \{/;

const restoreCode = `
    const coins = ['USDT', 'BTC', 'ETH'];
    const fiats = ['RUB', 'KZT', 'BYN'];
    
    function populateInitialActivity() {
        const tbody = document.getElementById('activity-tbody');
        if(!tbody) return;
        tbody.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            generateRandomActivity(false);
        }
    }

    function generateRandomActivity(prepend = true) {
        const tbody = document.getElementById('activity-tbody');
        if(!tbody) return;
        
        const isBuy = Math.random() > 0.5;
        const coin = coins[Math.floor(Math.random() * coins.length)];
        const fiat = fiats[Math.floor(Math.random() * fiats.length)];
        const direction = isBuy ? \`\${coin} -> \${fiat}\` : \`\${fiat} -> \${coin}\`;
        
        let amount;
        if (coin === 'USDT') amount = (Math.random() * 2000 + 50).toFixed(2);
        else if (coin === 'BTC') amount = (Math.random() * 0.05 + 0.001).toFixed(4);
        else amount = (Math.random() * 2 + 0.1).toFixed(3);
        
        const statusMapEng = { completed: 'Completed', open: 'Open', cancelled: 'Cancelled' };
        const statusMapRus = { completed: 'Завершено', open: 'Открыт', cancelled: 'Отменено' };
        
        const statTitle = currentLang === 'en' ? statusMapEng['completed'] : statusMapRus['completed'];
        const timingText = currentLang === 'en' ? (prepend ? 'just now' : Math.floor(Math.random()*59+1) + ' min ago') : (prepend ? 'только что' : Math.floor(Math.random()*59+1) + ' мин назад');

        const tr = document.createElement('tr');
        if (prepend) {
            tr.style.animation = "flashGreen 1s ease-out";
        }
        
        tr.innerHTML = 
            '<td><b>' + direction + '</b></td>' +
            '<td>' + amount + ' ' + (isBuy ? fiat : coin) + '</td>' +
            '<td><span class="status-badge completed">' + statTitle + '</span></td>' +
            '<td style="color: var(--text-muted);">' + timingText + '</td>';
            
        if (prepend) {
            tbody.insertBefore(tr, tbody.firstChild);
            if (tbody.children.length > 8) {
                tbody.removeChild(tbody.lastChild);
            }
        } else {
            tbody.appendChild(tr);
        }
    }

    // Delay random 10s to 60s
    function scheduleActivity() {
        const delay = Math.floor(Math.random() * 50000) + 10000;
        setTimeout(() => {
            generateRandomActivity(true);
            scheduleActivity();
        }, delay);
    }

    // ==================== ЛОГИКА ФИЛЬТРАЦИИ ВКЛАДОК ====================
    function filterTree(type, category, tabElement) {
`;

code = code.replace(regex, restoreCode);

// Add populateInitialActivity() and scheduleActivity() to the DOMContentLoaded / Initialize UI section
const initRegex = /\/\/ Initialize UI\n    populateCurrencies\(\);/;
code = code.replace(initRegex, `// Initialize UI\n    populateCurrencies();\n    populateInitialActivity();\n    scheduleActivity();`);

fs.writeFileSync('index.html', code);
console.log('Client activity restored');
