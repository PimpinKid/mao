const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.resolve(__dirname, 'crypto.db'));

db.serialize(() => {
    // Add is_verified_trader to users if not exists
    db.run("ALTER TABLE users ADD COLUMN is_verified_trader BOOLEAN DEFAULT 0;", (err) => {
        if(err && !err.message.includes('duplicate column name')) console.error(err);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS p2p_deals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ad_id INTEGER,
            taker_id INTEGER,
            amount_fiat REAL,
            amount_crypto REAL,
            status TEXT DEFAULT 'open',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ad_id) REFERENCES p2p_ads(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS p2p_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            deal_id INTEGER,
            sender_type TEXT,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (deal_id) REFERENCES p2p_deals(id)
        )
    `, () => {
        console.log("DB Updated");
        db.close();
    });
});
