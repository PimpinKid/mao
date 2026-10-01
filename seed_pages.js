const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'crypto.db');
const db = new sqlite3.Database(dbPath);

const p2pItemsPerPage = 10;

const formulas = {
    'USDT': { pages: 8, base: 7 },
    'BTC': { pages: 6, base: 5 },
    'ETH': { pages: 5, base: 4 }
};

const banks = ['Сбербанк', 'Т-Банк', 'Альфа-Банк', 'Райффайзен', 'СБП'];
const names = ['ProTrade', 'Crypto_Ivan', 'FastSwap', 'CoinMaster', 'TradeKing', 'Satoshist', 'BestEx', 'TrustP2P', 'QuickCash', 'MoonTrader'];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomBanks() {
    const num = getRandomInt(1, 3);
    const shuffled = [...banks].sort(() => 0.5 - Math.random());
    return JSON.stringify(shuffled.slice(0, num));
}

const prices = {
    'USDT': { 'buy': 98.5, 'sell': 99.5 },
    'BTC': { 'buy': 9000000, 'sell': 9200000 },
    'ETH': { 'buy': 300000, 'sell': 310000 }
};

function generateUsers(existingCount, callback) {
    const needed = 50 - existingCount;
    if (needed <= 0) {
        return callback();
    }
    console.log(`Generating ${needed} new users...`);
    let count = 0;
    const stmt = db.prepare("INSERT INTO users (display_name, email, verification_status, is_verified_trader) VALUES (?, ?, ?, ?)");
    for (let i = 0; i < needed; i++) {
        const name = names[getRandomInt(0, names.length - 1)] + '_' + getRandomInt(100, 9999);
        const email = `trader_${getRandomInt(10000, 999999)}@test.com`;
        stmt.run(name, email, 'verified', 1, (err) => {
            count++;
            if (count === needed) {
                stmt.finalize();
                callback();
            }
        });
    }
}

db.serialize(() => {
    db.run("DELETE FROM p2p_ads", (err) => {
        if (err) console.error("Error clearing p2p_ads:", err);
        else console.log("p2p_ads cleared.");
    });

    db.all("SELECT id FROM users", (err, users) => {
        if (err) throw err;
        
        generateUsers(users.length, () => {
            db.all("SELECT id FROM users", (err, allUsers) => {
                if (err) throw err;
                
                const userIds = allUsers.map(u => u.id);
                let adsToInsert = [];
                
                ['buy', 'sell'].forEach(type => {
                    Object.keys(formulas).forEach(crypto => {
                        const conf = formulas[crypto];
                        const totalAds = (conf.base * p2pItemsPerPage) + getRandomInt(2, p2pItemsPerPage - 1);
                        console.log(`Generating ${totalAds} ${type} ads for ${crypto}...`);
                        
                        for (let i = 0; i < totalAds; i++) {
                            const maker_id = userIds[getRandomInt(0, userIds.length - 1)];
                            const basePrice = prices[crypto][type];
                            const price = basePrice * (1 + (Math.random() * 0.04 - 0.02)); // +/- 2%
                            
                            const min_limit = getRandomInt(1000, 5000);
                            const max_limit = getRandomInt(10000, 500000);
                            const payment_methods = getRandomBanks();
                            const available_amount = getRandomInt(100, 10000);
                            
                            adsToInsert.push([maker_id, type, crypto, 'RUB', price.toFixed(2), min_limit, max_limit, payment_methods, 'active', available_amount]);
                        }
                    });
                });
                
                const stmt = db.prepare("INSERT INTO p2p_ads (maker_id, type, crypto, fiat, price, min_limit, max_limit, payment_methods, status, available_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                
                db.serialize(() => {
                    db.run("BEGIN TRANSACTION");
                    adsToInsert.forEach(ad => {
                        stmt.run(ad);
                    });
                    db.run("COMMIT", () => {
                        console.log("All ads inserted successfully!");
                        stmt.finalize();
                        db.close();
                    });
                });
            });
        });
    });
});
