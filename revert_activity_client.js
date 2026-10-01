const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Restore the client-side fake activity generator
const replacement = `
    // ==================== ЛОГИКА ФИЛЬТРАЦИИ ВКЛАДОК ====================
    function filterTree(type, category, tabElement) {
`;

const fetchActivityRegex = /async function fetchActivity\(\) \{[\s\S]*?\/\/\s*==================== ЛОГИКА ФИЛЬТРАЦИИ ВКЛАДОК ====================/g;
code = code.replace(fetchActivityRegex, replacement);

const renderActivityTableRegex = /function renderActivityTable\(trades\) \{[\s\S]*?\} \/\/\s*END RENDER ACTIVITY TABLE/g;
// Actually I don't know if END RENDER ACTIVITY TABLE exists. Let's just replace the whole function block.
