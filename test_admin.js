const fs = require('fs');
const html = fs.readFileSync('admin.html', 'utf8');
const regex = /<script>([\s\S]*?)<\/script>/g;
let match;
while ((match = regex.exec(html)) !== null) {
    try {
        new Function(match[1]);
    } catch (e) {
        console.error("Syntax Error in script block:", e.message);
    }
}
