const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace SBP Icon
const newSbpIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%231f242d'/><path d='M44 28 L28 55 H44 Z' fill='%2338bdf8' rx='2'/><path d='M56 28 L72 55 H56 Z' fill='%23fbbf24' rx='2'/><path d='M32 61 H68 L50 78 Z' fill='%234ade80' rx='2'/></svg>";
html = html.replace(/const sbpIcon = "data:image[^"]+";/, `const sbpIcon = "${newSbpIcon}";`);

// Replace XRP Icon
const newXrpIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%231f242d'/><path d='M35 30 L50 45 L65 30 L70 35 L55 50 L70 65 L65 70 L50 55 L35 70 L30 65 L45 50 L30 35 Z' fill='%23ffffff'/></svg>";
html = html.replace(/{ code: 'XRP', name: 'XRP', category: 'crypto', icon: 'https:\/\/cryptologos.cc\/logos\/xrp-xrp-logo.svg\?v=032',/g, `{ code: 'XRP', name: 'XRP', category: 'crypto', icon: "${newXrpIcon}",`);

fs.writeFileSync('index.html', html);
console.log('Icons updated successfully.');
