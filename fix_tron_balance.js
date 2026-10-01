const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regexToReplace = /let usdtBalance = "0\.0";\s*try \{\s*let usdtAddress = "0x55d398326f99059fF775485246999027B3197955";[\s\S]*?console\.warn\("Could not fetch USDT balance", e\);\s*\}/;

const newEvmBalanceCheck = `
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
`;

content = content.replace(regexToReplace, newEvmBalanceCheck);
fs.writeFileSync('index.html', content);
