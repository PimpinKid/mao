const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Replace 100vw with 100% to fix horizontal scroll
content = content.replace(/width:\s*100vw/g, 'width: 100%');

// Fix z-index scale
// Header should be 100, modal-overlay should be 2000
content = content.replace(/header \{\s*position: sticky; top: 38px; z-index: 1000;/g, 'header { \n            position: sticky; top: 38px; z-index: 100;');
content = content.replace(/z-index:\s*1000; justify-content: center;/g, 'z-index: 2000; justify-content: center;');

// The offline banner should be highest
content = content.replace(/z-index:999999;/g, 'z-index:3000;');

// Deal closure overlay should be very high
content = content.replace(/z-index: 999999;/g, 'z-index: 2500;');

fs.writeFileSync('index.html', content);
