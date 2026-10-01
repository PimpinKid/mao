const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const restoreLogic = `
    document.addEventListener('DOMContentLoaded', () => {
        const savedAddress = sessionStorage.getItem('web3_signed_address');
        if (savedAddress) {
            const btnWeb3 = document.getElementById('btn-connect-web3');
            const btnDisconnect = document.getElementById('btn-disconnect-web3');
            if (btnWeb3) btnWeb3.innerText = 'Подключено: ' + savedAddress.slice(0, 6) + '...' + savedAddress.slice(-4);
            if (btnDisconnect) btnDisconnect.style.display = 'block';
        }
    });
`;

content = content.replace(
    'window.disconnectWeb3Wallet = async function()',
    restoreLogic + '\n    window.disconnectWeb3Wallet = async function()'
);

fs.writeFileSync('index.html', content);
