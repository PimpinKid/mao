const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /function populateInitialActivity\(\) \{[\s\S]*?function scheduleActivity\(\) \{/;

const replacement = `function populateInitialActivity() {
        const tbody = document.getElementById('activity-tbody');
        if(!tbody) return;
        tbody.innerHTML = '';
        
        // Generate 8 initial times in increasing order (e.g., 1 min, 3 min, 5 min)
        let times = [];
        let currTime = 1;
        for (let i = 0; i < 8; i++) {
            times.push(currTime);
            currTime += Math.floor(Math.random() * 3) + 1;
        }
        
        for (let i = 0; i < 8; i++) {
            generateRandomActivity(false, times[i]);
        }
    }

    function generateRandomActivity(prepend = true, specificTimeMin = null) {
        const tbody = document.getElementById('activity-tbody');
        if(!tbody) return;
        
        const isBuy = Math.random() > 0.5;
        const coin = coins[Math.floor(Math.random() * coins.length)];
        const fiat = fiats[Math.floor(Math.random() * fiats.length)];
        const direction = isBuy ? \`\${coin} -> \${fiat}\` : \`\${fiat} -> \${coin}\`;
        
        // Always generate a logical fiat amount
        let fiatAmount = Math.floor(Math.random() * 150000) + 5000; // 5k to 155k
        // Then convert to crypto if we want to display crypto, or just show fiat
        // To avoid confusion, let's just always display the fiat amount for the activity feed, since P2P trades are mostly measured in Fiat volume.
        // Or show the coin amount. Let's show Coin amount AND Fiat amount? The design only has one column for amount.
        // In the screenshot, the user has "0.0153 KZT" - that means it showed crypto value but appended the fiat currency!
        // Let's fix it so it always shows the fiat amount with fiat currency, or crypto amount with crypto currency, correctly matching.
        let amountText = '';
        if (isBuy) {
            // coin -> fiat. Selling coin, receiving fiat. Let's show Fiat amount.
            amountText = fiatAmount.toLocaleString('ru-RU') + ' ' + fiat;
        } else {
            // fiat -> coin. Selling fiat, receiving coin. Let's show Fiat amount as well, it's easier and consistent.
            amountText = fiatAmount.toLocaleString('ru-RU') + ' ' + fiat;
        }
        
        const statusMapEng = { completed: 'Completed', open: 'Open', cancelled: 'Cancelled' };
        const statusMapRus = { completed: 'Завершено', open: 'Открыт', cancelled: 'Отменено' };
        
        const statTitle = currentLang === 'en' ? statusMapEng['completed'] : statusMapRus['completed'];
        
        // Determine timing text
        let timingText = '';
        let timingIdx = 0;
        if (prepend) {
            timingIdx = 0; // "just now"
        } else {
            const minutes = specificTimeMin || (Math.floor(Math.random() * 15) + 1);
            timingText = currentLang === 'en' ? minutes + ' min ago' : minutes + ' мин назад';
        }
        
        if (prepend) {
            timingText = currentLang === 'en' ? 'just now' : 'только что';
        }

        const tr = document.createElement('tr');
        if (prepend) {
            tr.style.animation = "flashGreen 1s ease-out";
        }
        
        tr.innerHTML = 
            '<td><b>' + direction + '</b></td>' +
            '<td>' + amountText + '</td>' +
            '<td><span class="status-badge completed" data-stat-class="completed">' + statTitle + '</span></td>' +
            '<td data-timing-custom="' + (prepend ? 'now' : specificTimeMin) + '" style="color: var(--text-muted);">' + timingText + '</td>';
            
        if (prepend) {
            tbody.insertBefore(tr, tbody.firstChild);
            if (tbody.children.length > 8) {
                tbody.removeChild(tbody.lastChild);
            }
            // Increase time of all subsequent rows slightly to simulate time passing? Not strictly necessary for UI feel.
        } else {
            tbody.appendChild(tr);
        }
    }

    function scheduleActivity() {`;

code = code.replace(regex, replacement);
fs.writeFileSync('index.html', code);
console.log('Activity sorting and amounts fixed');
