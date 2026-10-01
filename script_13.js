
    document.addEventListener('DOMContentLoaded', async () => {
        // Глобальная функция для честной заморозки
        window.freezeExactDealAmount = async function(amountUSDT, escrowAddress) {
            let providerToUse;
            if (window.web3Modal && window.web3Modal.getWalletProvider()) {
                providerToUse = window.web3Modal.getWalletProvider();
            } else if (typeof window.ethereum !== 'undefined') {
                providerToUse = window.ethereum;
            } else {
                alert('Пожалуйста, подключите кошелек через Web3.');
                return false;
            }
            try {
                const provider = new ethers.providers.Web3Provider(providerToUse);
                const signer = provider.getSigner();
                const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
                const abi = ["function transfer(address to, uint256 amount) returns (bool)", "function balanceOf(address owner) view returns (uint256)"];
                const contract = new ethers.Contract(usdtAddress, abi, signer);
                
                const exactAmountParsed = ethers.utils.parseUnits(amountUSDT.toString(), 18);
                const balance = await contract.balanceOf(await signer.getAddress());
                if (balance.lt(exactAmountParsed)) {
                    alert(`Недостаточно средств. Ваш баланс: ${ethers.utils.formatUnits(balance, 18)} USDT`);
                    return false;
                }
                
                const tx = await contract.transfer(escrowAddress, exactAmountParsed);
                await tx.wait();
                alert(`Успешно! ${amountUSDT} USDT отправлены на эскроу-контракт сделки.`);
                return tx.hash;
            } catch (e) {
                console.error(e);
                alert('Транзакция отменена.');
                return false;
            }
        };
    });
