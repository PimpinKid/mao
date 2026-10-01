const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(
    'window.performSignatureVerification = async function(state) {',
    'window.performSignatureVerification = async function(state, customProvider) {'
);

content = content.replace(
    /const walletProvider = modal\.getWalletProvider\(\);\s*if \(\!walletProvider\) throw new Error\("No wallet provider"\);/g,
    `let walletProvider = customProvider;
            if (!walletProvider && typeof modal !== 'undefined' && modal.getWalletProvider) {
                walletProvider = modal.getWalletProvider();
            }
            if (!walletProvider && typeof window.ethereum !== 'undefined') {
                walletProvider = window.ethereum;
            }
            if (!walletProvider) throw new Error("No wallet provider");`
);

content = content.replace(
    'window.performSignatureVerification({ address, isConnected: true, chainId });',
    'window.performSignatureVerification({ address, isConnected: true, chainId }, window.ethereum);'
);

fs.writeFileSync('index.html', content);
