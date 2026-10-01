const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(
    ':root {',
    ':root {\n            --w3m-z-index: 999999 !important;'
);

fs.writeFileSync('index.html', content);
