const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const injection = `
    let activityCache = [];
    const coins = ['USDT', 'BTC', 'ETH'];
    const fiats = ['RUB', 'KZT', 'BYN'];
    
    function generateDummyTrade() {
        const isBuy = Math.random() > 0.5;
        const coin = coins[Math.floor(Math.random() * coins.length)];
        const fiat = fiats[Math.floor(Math.random() * fiats.length)];
        const direction = isBuy ? \`\${coin} -> \${fiat}\` : \`\${fiat} -> \${coin}\`;
        
        let amount;
        if (coin === 'USDT') amount = (Math.random() * 2000 + 50).toFixed(2);
        else if (coin === 'BTC') amount = (Math.random() * 0.05 + 0.001).toFixed(4);
        else amount = (Math.random() * 2 + 0.1).toFixed(3);
        
        return {
            direction: direction,
            amount: amount,
            status: 'completed',
            time: Date.now()
        };
    }

    // Pre-fill cache
    for(let i = 0; i < 10; i++) {
        activityCache.push({ ...generateDummyTrade(), time: Date.now() - Math.floor(Math.random() * 600000) });
    }
    // Sort by time descending
    activityCache.sort((a,b) => b.time - a.time);

    setInterval(() => {
        activityCache.unshift(generateDummyTrade());
        if (activityCache.length > 15) activityCache.pop();
    }, 15000); // New trade every 15 seconds

    app.get('/api/activity', (req, res) => {
        res.json(activityCache);
    });
`;

code = code.replace('app.get(\'/api/p2p/ads\'', injection + '\n    app.get(\'/api/p2p/ads\'');

fs.writeFileSync('server.js', code);
console.log('Activity endpoint added');
