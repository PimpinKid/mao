const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regexCoins = /const coins = \['USDT', 'BTC', 'ETH'\];/;
const regexFiats = /const fiats = \['RUB', 'KZT', 'BYN'\];/;

const replacementCoins = `const coins = ['USDT', 'BTC', 'ETH', 'USDC', 'SOL', 'BNB', 'TON', 'TRX', 'XRP', 'DOGE', 'LTC'];`;
const replacementFiats = `const fiats = ['RUB'];`;

code = code.replace(regexCoins, replacementCoins);
code = code.replace(regexFiats, replacementFiats);

fs.writeFileSync('index.html', code);
console.log('Activity coins and fiats fixed');
