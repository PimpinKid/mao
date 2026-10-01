const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(
    'window.performSignatureVerification = async function',
    'window.isSigning = false;\n    window.performSignatureVerification = async function'
);
content = content.replace(/isSigning/g, 'window.isSigning');
content = content.replace(/let window\.window\.isSigning = false;/g, ''); // cleanup if any

fs.writeFileSync('index.html', content);
