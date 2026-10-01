const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const sigFuncRegex = /window\.performSignatureVerification = async function\(state, customProvider\) \{([\s\S]*?)\}\s*modal\.subscribeProvider/g;

let sigFuncStr = '';
content = content.replace(sigFuncRegex, (match, p1) => {
    sigFuncStr = 'window.performSignatureVerification = async function(state, customProvider) {' + p1 + '}';
    return '    modal.subscribeProvider';
});

if (sigFuncStr) {
    content = content.replace(
        '// Robust Global Wallet Connect Function',
        sigFuncStr + '\n\n    // Robust Global Wallet Connect Function'
    );
}

fs.writeFileSync('index.html', content);
