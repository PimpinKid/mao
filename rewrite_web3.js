const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const newConnectLogic = `
    // Robust Global Wallet Connect Function
    window.connectWeb3Wallet = async function() {
        try {
            let injectedProvider = null;
            if (window.ethereum) injectedProvider = window.ethereum;
            else if (window.trustwallet) injectedProvider = window.trustwallet;
            else if (window.BinanceChain) injectedProvider = window.BinanceChain;

            if (injectedProvider) {
                // Если есть расширение, вызываем его напрямую
                try {
                    const accounts = await injectedProvider.request({ method: 'eth_requestAccounts' });
                    if (accounts && accounts[0]) {
                        const address = accounts[0];
                        const chainIdHex = await injectedProvider.request({ method: 'eth_chainId' });
                        const chainId = parseInt(chainIdHex, 16);
                        
                        if (window.performSignatureVerification) {
                            window.performSignatureVerification({ address, isConnected: true, chainId }, injectedProvider);
                        } else {
                            document.getElementById('btn-connect-web3').innerText = 'Подключено: ' + address.slice(0, 6) + '...' + address.slice(-4);
                        }
                    }
                } catch (err) {
                    if (err.code === 4001) alert('Вы отменили подключение в расширении.');
                    else alert('Ошибка расширения: ' + err.message);
                }
            } else if (window.web3Modal) {
                // Если расширений нет, открываем модалку Web3Modal (для WalletConnect / QR кодов)
                await window.web3Modal.open();
            } else {
                alert('Не найден Web3 кошелек! Убедитесь, что расширение MetaMask включено. Если у вас несколько кошельков (MetaMask + TrustWallet), они могут конфликтовать — попробуйте отключить один из них.');
            }
        } catch (e) {
            console.error('Wallet connect error:', e);
            alert('Ошибка: ' + e.message);
        }
    };
`;

content = content.replace(/\/\/ Robust Global Wallet Connect Function[\s\S]*?\} catch \(e\) \{\s*console\.error\('Wallet connect error:', e\);\s*alert\('Ошибка подключения: ' \+ e\.message\);\s*\}\s*\};\s*/, newConnectLogic);

// Also need to fix performSignatureVerification to not rely on modal if modal crashed
const oldSig = `let walletProvider = customProvider;
            if (!walletProvider && typeof modal !== 'undefined' && modal.getWalletProvider) {
                walletProvider = modal.getWalletProvider();
            }
            if (!walletProvider && typeof window.ethereum !== 'undefined') {
                walletProvider = window.ethereum;
            }
            if (!walletProvider) throw new Error("No wallet provider");`;

const newSig = `let walletProvider = customProvider;
            if (!walletProvider && typeof window.ethereum !== 'undefined') {
                walletProvider = window.ethereum;
            }
            if (!walletProvider && typeof window.trustwallet !== 'undefined') {
                walletProvider = window.trustwallet;
            }
            if (!walletProvider && typeof modal !== 'undefined' && modal.getWalletProvider) {
                try { walletProvider = modal.getWalletProvider(); } catch(e) {}
            }
            if (!walletProvider) throw new Error("Кошелек не предоставил доступ (No wallet provider). Убедитесь что расширение разблокировано.");`;

content = content.replace(oldSig, newSig);

fs.writeFileSync('index.html', content);
