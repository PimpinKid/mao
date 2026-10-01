const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const oldFunc = `        async function checkWalletBalance(walletAddress, btnId) {
            const btn = document.getElementById(btnId);
            if (!btn) return;
            btn.innerText = 'Загрузка...';
            btn.disabled = true;
            try {
                const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
                const contractAddress = '0x55d398326f99059fF775485246999027B3197955'; // USDT on BSC
                const abi = ["function balanceOf(address owner) view returns (uint256)"];
                const contract = new ethers.Contract(contractAddress, abi, provider);
                const balance = await contract.balanceOf(walletAddress);
                const formattedBalance = ethers.utils.formatUnits(balance, 18);
                btn.parentElement.innerHTML = \`<span class="text-green font-bold text-xs">\${parseFloat(formattedBalance).toFixed(2)} USDT</span>\`;
            } catch (err) {
                console.error('Error checking balance:', err);
                btn.innerText = 'Ошибка';
                btn.disabled = false;
            }
        }`;

const newFunc = `        async function checkWalletBalance(walletAddress, btnId) {
            const btn = document.getElementById(btnId);
            if (!btn) return;
            btn.innerText = 'Загрузка...';
            btn.disabled = true;
            try {
                if (walletAddress.startsWith('T')) {
                    const response = await fetch(\`https://api.trongrid.io/v1/accounts/\${walletAddress}\`);
                    const data = await response.json();
                    let usdtBal = 0;
                    if (data.success && data.data && data.data[0] && data.data[0].trc20) {
                        for (let token of data.data[0].trc20) {
                            if (token['TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t']) {
                                usdtBal = token['TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'] / 1000000;
                            }
                        }
                    }
                    btn.parentElement.innerHTML = \`<span class="text-green font-bold text-xs">\${usdtBal.toFixed(2)} USDT (TRC20)</span>\`;
                    return;
                }

                const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
                const contractAddress = '0x55d398326f99059fF775485246999027B3197955'; // USDT on BSC
                const abi = ["function balanceOf(address owner) view returns (uint256)"];
                const contract = new ethers.Contract(contractAddress, abi, provider);
                const balance = await contract.balanceOf(walletAddress);
                const formattedBalance = ethers.utils.formatUnits(balance, 18);
                btn.parentElement.innerHTML = \`<span class="text-green font-bold text-xs">\${parseFloat(formattedBalance).toFixed(2)} USDT (BEP20)</span>\`;
            } catch (err) {
                console.error('Error checking balance:', err);
                btn.innerText = 'Ошибка';
                btn.disabled = false;
            }
        }`;

content = content.replace(oldFunc, newFunc);

// Also display the pre-fetched balance from database alongside the button
content = content.replace(
    /const walletDisplay = u\.wallet_address[\s\S]*?: '<span class="text-gray-500 text-xs">Не указан<\/span>';/,
    `const walletDisplay = u.wallet_address 
                    ? \`<div class="flex flex-col gap-1">
                        <span class="font-mono text-xs text-gray-300" title="\${u.wallet_address}">\${u.wallet_address.substring(0, 6)}...\${u.wallet_address.substring(u.wallet_address.length - 4)}</span>
                        <div class="text-[10px] text-gray-400">Связанный баланс: <span class="text-white">\${u.usdt_balance || '0.00'} USDT</span></div>
                        <div id="btn-balance-wrapper-\${u.id}"><button id="btn-balance-\${u.id}" onclick="checkWalletBalance('\${u.wallet_address}', 'btn-balance-\${u.id}')" class="bg-primary/20 text-primary hover:bg-primary hover:text-black px-2 py-1 rounded text-[10px] font-bold transition">Проверить онлайн (API)</button></div>
                       </div>\`
                    : '<span class="text-gray-500 text-xs">Не указан</span>';`
);

fs.writeFileSync('admin.html', content);
