const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const scriptRegex = /<script.*?>([\s\S]*?)<\/script>/gi;
let match;
let i = 0;
while ((match = scriptRegex.exec(html)) !== null) {
    i++;
    if (match[0].includes('type="module"')) continue; // skip module syntax
    try {
        new Function(match[1]);
    } catch (e) {
        console.error('Syntax error in script block ' + i + ':', e.message);
        const lines = match[1].split('\n');
        console.log('Around: ' + lines[0]);
    }
}
console.log('Syntax check complete.');
