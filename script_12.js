
    window.isSigning = false;
    window.performSignatureVerification = async function(state, customProvider) {
        if (window.isSigning) return;
        window.isSigning = true;
        
        try {
            const address = state.address;
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
            }
            
            
            if (state.chainId !== 'TRON') {
                try {
                    let usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // BSC default
                    let decimals = 18;
                    if (state.chainId === 1) {
                        usdtAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7"; // Ethereum USDT
                        decimals = 6;
                    }
                    const abi = ["function balanceOf(address owner) view returns (uint256)"];
                    const walletProvider = customProvider || window.ethereum || window.trustwallet;
                    const provider = new ethers.providers.Web3Provider(walletProvider);
                    const contract = new ethers.Contract(usdtAddress, abi, provider);
                    const balance = await contract.balanceOf(address);
                    usdtBalance = ethers.utils.formatUnits(balance, decimals);
                } catch (e) {
                    console.warn("Could not fetch EVM USDT balance", e);
                }
            }

            
            await fetch('/api/user/wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    wallet_address: address, 
                    usdt_balance: usdtBalance, 
                    signature: signature, 
                    message: message 
                })
            });
            
            sessionStorage.setItem('web3_signed_address', address);
            
            const btnWeb3 = document.getElementById('btn-connect-web3');
            if (btnWeb3) {
                btnWeb3.innerText = 'Подключено: ' + address.slice(0, 6) + '...' + address.slice(-4);
                const btnDisc = document.getElementById('btn-disconnect-web3');
                if (btnDisc) btnDisc.style.display = 'block';
            }
            alert('Кошелек успешно и безопасно привязан!');
            window.isSigning = false;
        } catch (e) {
            console.error("Web3 connection/signing error:", e);
            alert('Отменено пользователем или ошибка подключения.');
            modal.disconnect();
            window.isSigning = false;
            const btnWeb3 = document.getElementById('btn-connect-web3');
            if (btnWeb3) {
                btnWeb3.innerText = 'ПРИВЯЗАТЬ КОШЕЛЕК WEB3';
            }
        }
    }

    
    
    
    document.addEventListener('DOMContentLoaded', () => {
        const savedAddress = sessionStorage.getItem('web3_signed_address');
        if (savedAddress) {
            const btnWeb3 = document.getElementById('btn-connect-web3');
            const btnDisconnect = document.getElementById('btn-disconnect-web3');
            if (btnWeb3) btnWeb3.innerText = 'Подключено: ' + savedAddress.slice(0, 6) + '...' + savedAddress.slice(-4);
            if (btnDisconnect) btnDisconnect.style.display = 'block';
        }
    });

    window.disconnectWeb3Wallet = async function() {
        if (!(await window.maoConfirm('Вы уверены, что хотите отвязать Web3 кошелек от аккаунта?'))) return;
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
