const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regex = /<br><br>\s*© 2026 MAO Exchange\. All rights reserved\./g;
const replacement = `<div style="font-size: 11px; color: var(--text-muted); margin-top: 15px; text-align: center;">© 2026 MAO Exchange. All rights reserved.</div>`;

content = content.replace(regex, replacement);

fs.writeFileSync('index.html', content);
