const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(/window\.window\.isSigning/g, 'window.isSigning');
content = content.replace(/let window\.isSigning = false;/g, '');

fs.writeFileSync('index.html', content);
