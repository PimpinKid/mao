const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Replace the function declaration to make it global
content = content.replace(
    'async function performSignatureVerification(state) {',
    'window.performSignatureVerification = async function(state) {'
);
content = content.replace(
    'performSignatureVerification(state);',
    'window.performSignatureVerification(state);'
);

fs.writeFileSync('index.html', content);
