const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const emptyLogic = `
    let emptyState = document.getElementById('p2p-empty-state-' + gridId);
    if (filteredCards.length === 0) {
        if (!emptyState) {
            emptyState = document.createElement('div');
            emptyState.id = 'p2p-empty-state-' + gridId;
            emptyState.style.cssText = 'grid-column: 1 / -1; padding: 60px 20px; text-align: center; color: var(--text-muted); background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 20px;';
            emptyState.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 15px; opacity: 0.5;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><h3 style="color: #fff; margin-bottom: 5px; font-weight: 600;">Объявления не найдены</h3><p style="font-size: 13px;">Попробуйте изменить фильтры (валюту или способ оплаты)</p>';
            grid.appendChild(emptyState);
        }
        emptyState.style.display = 'block';
    } else {
        if (emptyState) emptyState.style.display = 'none';
    }
`;

content = content.replace('    renderPagination(totalPages);\n}', emptyLogic + '\n    renderPagination(totalPages);\n}');
fs.writeFileSync('index.html', content);
