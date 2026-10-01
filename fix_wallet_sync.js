const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const walletSyncLogic = `
        if (user.wallet_address) {
            sessionStorage.setItem('web3_signed_address', user.wallet_address);
            const btnWeb3 = document.getElementById('btn-connect-web3');
            const btnDisconnect = document.getElementById('btn-disconnect-web3');
            if (btnWeb3) btnWeb3.innerText = 'Подключено: ' + user.wallet_address.slice(0, 6) + '...' + user.wallet_address.slice(-4);
            if (btnDisconnect) btnDisconnect.style.display = 'block';
        } else {
            sessionStorage.removeItem('web3_signed_address');
            const btnWeb3 = document.getElementById('btn-connect-web3');
            const btnDisconnect = document.getElementById('btn-disconnect-web3');
            if (btnWeb3) btnWeb3.innerText = 'ПОДКЛЮЧИТЬ WEB3 КОШЕЛЕК';
            if (btnDisconnect) btnDisconnect.style.display = 'none';
        }
        
        // Chat Protection
`;

content = content.replace(
    '// Chat Protection',
    walletSyncLogic
);

const guestWalletClearLogic = `
        sessionStorage.removeItem('web3_signed_address');
        const btnWeb3 = document.getElementById('btn-connect-web3');
        const btnDisconnect = document.getElementById('btn-disconnect-web3');
        if (btnWeb3) btnWeb3.innerText = 'ПОДКЛЮЧИТЬ WEB3 КОШЕЛЕК';
        if (btnDisconnect) btnDisconnect.style.display = 'none';

        // Block Chat
`;

content = content.replace(
    '// Block Chat',
    guestWalletClearLogic
);

fs.writeFileSync('index.html', content);
