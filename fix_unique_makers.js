const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('crypto.db');

const prefixes = ["Crypto", "Bit", "Coin", "Fast", "Trust", "Mega", "Pro", "Top", "Quick", "Smart", "Garant", "Solid", "Alpha", "Omega", "Easy", "Best", "Safe", "Super", "Prime", "Elite", "Max", "Neo", "Pay", "Cash", "True", "Gold", "Silver", "X", "One", "First"];
const suffixes = ["Trade", "Exchange", "Swap", "Pay", "Market", "Hub", "Dealer", "P2P", "Ex", "Bot", "Buy", "Sell", "Bank", "Wallet", "Ninja", "Master", "King", "Lord", "Boss", "Pro", "Expert", "Guru", "Man", "Boy", "Girl"];
const names = ["Alex", "Ivan", "Max", "Dmitry", "Sergey", "Anna", "Elena", "Igor", "Roman", "Pavel", "Andrey", "Oleg", "Mikhail", "Nikita", "Victor", "Artur", "Anton", "Denis", "Ilya", "Vlad", "Gleb", "Timur", "Yuri", "Artem", "Egor", "Kirill", "Lev", "Mark", "Petr", "Ruslan", "Stepan", "Fedor", "Yan"];
const styles = [
    () => `${pick(names)}`,
    () => `${pick(names)}${randomInt(10, 999)}`,
    () => `${pick(names)}_${pick(prefixes)}`,
    () => `${pick(prefixes)}${pick(suffixes)}`,
    () => `${pick(prefixes)}_${pick(suffixes)}`,
    () => `${pick(prefixes)}_${pick(names)}`,
    () => `${pick(names)}${pick(suffixes)}`,
    () => `Trader_${pick(names)}`,
    () => `${pick(names)}_${randomInt(100, 9999)}`,
    () => `${pick(names).toLowerCase()}_${pick(suffixes).toLowerCase()}`,
    () => `${pick(prefixes).toLowerCase()}${pick(names).toLowerCase()}`,
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

db.serialize(() => {
    db.all("SELECT id FROM p2p_ads", (err, ads) => {
        if (err) throw err;
        
        let generatedNames = new Set();
        let usersToInsert = [];
        
        // Generate a unique name for each ad
        for (let i = 0; i < ads.length; i++) {
            let attempts = 0;
            let newName = "";
            do {
                newName = pick(styles)();
                attempts++;
            } while (generatedNames.has(newName) && attempts < 100);
            
            generatedNames.add(newName);
            
            // random verified status for lots of deals
            const is_verified_trader = Math.random() > 0.6 ? 1 : 0;
            
            usersToInsert.push({
                ad_id: ads[i].id,
                display_name: newName,
                telegram_username: '@' + newName + '_' + randomInt(1000,9999),
                is_verified_trader
            });
        }
        
        // Insert these users and update the ads
        db.run("BEGIN TRANSACTION");
        
        let completed = 0;
        usersToInsert.forEach(u => {
            db.run(`INSERT INTO users (email, password_hash, display_name, telegram_username, is_verified_trader) 
                    VALUES (?, 'hash', ?, ?, ?)`, 
                [u.display_name + '@test.com', u.display_name, u.telegram_username, u.is_verified_trader], 
                function(err) {
                    if (err) { console.error(err); return; }
                    const newUserId = this.lastID;
                    db.run(`UPDATE p2p_ads SET maker_id = ? WHERE id = ?`, [newUserId, u.ad_id], (err) => {
                        completed++;
                        if (completed === usersToInsert.length) {
                            db.run("COMMIT", () => {
                                console.log(`Assigned exactly 1 unique user to each of the ${ads.length} ads.`);
                            });
                        }
                    });
            });
        });
    });
});
