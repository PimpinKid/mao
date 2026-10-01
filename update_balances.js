const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('crypto.db');

const strToHash = str => {
    let hash = 0;
    for(let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i) | 0;
    return Math.abs(hash);
};

db.all("SELECT p2p_ads.id, p2p_ads.crypto, p2p_ads.price, users.display_name FROM p2p_ads JOIN users ON p2p_ads.maker_id = users.id", (err, ads) => {
    
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        
        ads.forEach(ad => {
            const rawName = ad.display_name || 'Трейдер';
            const tradesCount = (strToHash(rawName) % 3000) + 100;
            
            // Base volume: ~500 RUB per trade (so 100 trades = 50k RUB, 3000 trades = 1.5M RUB)
            let targetFiat = tradesCount * 500; 
            
            const rand = Math.random();
            if (rand < 0.1) targetFiat = targetFiat * 0.1; // 10% chance: mostly sold out
            else if (rand < 0.15) targetFiat = targetFiat * 5; // 5% chance: whale with few trades
            else targetFiat = targetFiat * (0.8 + Math.random() * 0.4); // 85% chance: normal variance +/- 20%
            
            if (targetFiat < 5000) targetFiat = 5000 + Math.random() * 10000;
            if (targetFiat > 10000000) targetFiat = 5000000 + Math.random() * 5000000;
            
            const rate = ad.price || 100; // fallback just in case
            const available_amount = targetFiat / rate;
            
            let max_limit = targetFiat;
            let min_limit = targetFiat * (0.05 + Math.random() * 0.1); 
            
            if (min_limit < 1000) min_limit = 1000;
            else if (min_limit < 5000) min_limit = Math.floor(min_limit / 500) * 500;
            else min_limit = Math.floor(min_limit / 1000) * 1000;
            
            max_limit = Math.floor(max_limit / 100) * 100;
            
            db.run("UPDATE p2p_ads SET available_amount = ?, min_limit = ?, max_limit = ? WHERE id = ?", [available_amount, min_limit, max_limit, ad.id]);
        });
        
        db.run("COMMIT", () => {
            console.log("Balances updated based on trade counts!");
        });
    });
});
