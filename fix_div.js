const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(/<\/div>\s*<\/div>\s*<div class="bento-price-section">/g, '</div>\n                        <div class="bento-price-section">');

fs.writeFileSync('index.html', code);
