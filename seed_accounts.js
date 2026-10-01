const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('crypto.db');

const accounts = [
    { name: 'crypt0_hustler', email: 'crypt0_hustler@mail.com', pass: 'P@ssw0rd_hust!' },
    { name: 'TetherKing_msk', email: 'tetherking@msk.ru', pass: 'King$Tether2026' },
    { name: 'best_exchange_24', email: 'admin@bestexchange.net', pass: 'BExch#24_Secure' }
];

async function seed() {
    for (let acc of accounts) {
        const hash = await bcrypt.hash(acc.pass, 10);
        db.run(`INSERT INTO users (email, password_hash, display_name, is_verified_trader, role) VALUES (?, ?, ?, 1, 'user')`, 
            [acc.email, hash, acc.name], function(err) {
            if (err) return console.error(err);
            const userId = this.lastID;
            console.log(`Created user ${acc.name} with ID ${userId}`);
            
            // Give them random 180-210 deals
            const numDeals = Math.floor(Math.random() * 30) + 180;
            const stmt = db.prepare(`INSERT INTO p2p_deals (taker_id, status, amount_fiat, amount_crypto, type, escrow_step) VALUES (?, 'completed', 1000, 10, 'buy', 'completed')`);
            for (let i = 0; i < numDeals; i++) {
                stmt.run(userId);
            }
            stmt.finalize();
            console.log(`Added ${numDeals} deals for ${acc.name}`);
        });
    }
}

db.serialize(() => {
    seed();
});
