const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /\/\/ ==================== ЛОГИКА ФИЛЬТРАЦИИ ВКЛАДОК ====================/;

const replacement = `function populateCurrencies() {
        buildCurrencyTree('from-tree', 'from', activeFromCategory || 'fiat');
        buildCurrencyTree('to-tree', 'to', activeToCategory || 'crypto');
    }

    // ==================== ЛОГИКА ФИЛЬТРАЦИИ ВКЛАДОК ====================`;

code = code.replace(regex, replacement);

fs.writeFileSync('index.html', code);
console.log('populateCurrencies restored');
