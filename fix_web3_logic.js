const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const globalScript = `
<script>
    // Robust Global Wallet Connect Function
    window.connectWeb3Wallet = async function() {
        try {
            if (window.web3Modal) {
                await window.web3Modal.open();
            } else if (typeof window.ethereum !== 'undefined') {
                // Fallback to direct MetaMask injection if Web3Modal failed to load module
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts[0]) {
                    const address = accounts[0];
                    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
                    const chainId = parseInt(chainIdHex, 16);
                    
                    if (window.performSignatureVerification) {
                        window.performSignatureVerification({ address, isConnected: true, chainId });
                    } else {
                        document.getElementById('btn-connect-web3').innerText = 'Подключено: ' + address.slice(0, 6) + '...' + address.slice(-4);
                    }
                }
            } else {
                alert('Не найден Web3 кошелек. Установите MetaMask, TrustWallet или зайдите с браузера, поддерживающего Web3.');
            }
        } catch (e) {
            console.error('Wallet connect error:', e);
            alert('Ошибка подключения: ' + e.message);
        }
    };
</script>
<script type="module">`;

content = content.replace('<script type="module">', globalScript);

fs.writeFileSync('index.html', content);
