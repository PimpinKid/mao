const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Replace the inline style on the checkbox at 10472 (terms and conditions checkbox in auth modal)
content = content.replace(
    '<input type="checkbox" checked style="accent-color: var(--accent-orange); width: 16px; height: 16px;">',
    '<input type="checkbox" checked>'
);

fs.writeFileSync('index.html', content);
