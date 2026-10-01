const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('function renderActivityTable(trades) {');
const endIdx = html.indexOf('async function fetchActivity() {');

if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `function renderActivityTable(trades) {
        const tbody = document.getElementById('activity-tbody');
        if (!tbody) return;
        
        const existingCount = tbody.children.length;
        tbody.innerHTML = '';
        
        trades.forEach((trade, idx) => {
            const statClass = trade.status || 'completed';
            const statTitle = currentLang === 'en' ? (statusMapEn[statClass] || statClass) : (statusMapRu[statClass] || statClass);
            
            let timingText = '';
            const diffMs = Date.now() - trade.time;
            const diffMin = Math.floor(diffMs / 60000);
            if (diffMin < 1) {
                timingText = currentLang === 'en' ? 'just now' : 'только что';
            } else {
                timingText = currentLang === 'en' ? diffMin + ' min ago' : diffMin + ' мин назад';
            }

            const tr = document.createElement('tr');
            if (idx === 0 && existingCount > 0) {
                tr.style.animation = "flashGreen 1s ease-out";
            }
            
            let directionHTML = '<b>' + (trade.direction || '') + '</b>';
            let amountHTML = trade.amount ? trade.amount.toLocaleString('ru-RU') + ' RUB' : '0';
            
            tr.innerHTML = 
                '<td>' + directionHTML + '</td>' +
                '<td>' + amountHTML + '</td>' +
                '<td><span class="status-badge ' + statClass + '" data-stat-class="' + statClass + '">' + statTitle + '</span></td>' +
                '<td style="color: var(--text-muted);">' + timingText + '</td>';
                
            tbody.appendChild(tr);
        });
    }

    `;
    
    html = html.substring(0, startIdx) + replacement + html.substring(endIdx);
    fs.writeFileSync('index.html', html);
    console.log("Replaced successfully!");
} else {
    console.log("Indexes not found");
}
