const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regex = /<div style="text-align: right; display: flex; flex-direction: column; justify-content: center;">/;
const replacement = '<div style="text-align: right; display: flex; flex-direction: column; justify-content: center; margin-right: 35px;">';

content = content.replace(regex, replacement);

fs.writeFileSync('index.html', content);
