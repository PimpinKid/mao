const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const disconnectLogic = `
    window.disconnectWeb3Wallet = async function() {
        if (!confirm('Вы уверены, что хотите отвязать Web3 кошелек от аккаунта?')) return;
        try {
            await fetch('/api/user/wallet/disconnect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            sessionStorage.removeItem('web3_signed_address');
            if (window.web3Modal) {
                try { window.web3Modal.disconnect(); } catch(e){}
            }
            const btnWeb3 = document.getElementById('btn-connect-web3');
            const btnDisconnect = document.getElementById('btn-disconnect-web3');
            if (btnWeb3) btnWeb3.innerText = 'ПОДКЛЮЧИТЬ WEB3 КОШЕЛЕК';
            if (btnDisconnect) btnDisconnect.style.display = 'none';
            alert('Кошелек успешно отвязан.');
        } catch(e) {
            alert('Ошибка при отвязке: ' + e.message);
        }
    };
`;

content = content.replace(
    '// Robust Global Wallet Connect Function',
    disconnectLogic + '\n    // Robust Global Wallet Connect Function'
);

// Show the disconnect button when connected
content = content.replace(
    /document\.getElementById\('btn-connect-web3'\)\.innerText = 'Подключено: ' \+ address\.slice\(0, 6\) \+ '\.\.\.' \+ address\.slice\(-4\);/g,
    `document.getElementById('btn-connect-web3').innerText = 'Подключено: ' + address.slice(0, 6) + '...' + address.slice(-4);
                            const btnDisc = document.getElementById('btn-disconnect-web3');
                            if (btnDisc) btnDisc.style.display = 'block';`
);

// Also need to handle it in performSignatureVerification
content = content.replace(
    /btnWeb3\.innerText = 'Подключено: ' \+ address\.slice\(0, 6\) \+ '\.\.\.' \+ address\.slice\(-4\);/g,
    `btnWeb3.innerText = 'Подключено: ' + address.slice(0, 6) + '...' + address.slice(-4);
                const btnDisc = document.getElementById('btn-disconnect-web3');
                if (btnDisc) btnDisc.style.display = 'block';`
);

// Also handle the sessionStorage load on refresh inside the module
content = content.replace(
    /btnWeb3\.innerText = 'Подключено: ' \+ state\.address\.slice\(0, 6\) \+ '\.\.\.' \+ state\.address\.slice\(-4\);/g,
    `btnWeb3.innerText = 'Подключено: ' + state.address.slice(0, 6) + '...' + state.address.slice(-4);
                    const btnDisc = document.getElementById('btn-disconnect-web3');
                    if (btnDisc) btnDisc.style.display = 'block';`
);

fs.writeFileSync('index.html', content);
