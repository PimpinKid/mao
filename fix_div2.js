const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(/<\/div>\n\s*\$\{badgeHtml\}\n\s*<\/div>\n\s*<\/div>/g, '</div>\n                            ${badgeHtml}\n                        </div>');

fs.writeFileSync('index.html', code);
console.log('Fixed extra div');
