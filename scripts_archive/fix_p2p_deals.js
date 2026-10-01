const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.resolve(__dirname, 'crypto.db'));

db.serialize(() => {
    // Add columns to p2p_deals for ad-less deals
    const cols = ['maker_name TEXT', 'rate REAL', 'asset TEXT', 'fiat TEXT', 'type TEXT'];
    cols.forEach(col => {
        db.run(`ALTER TABLE p2p_deals ADD COLUMN ${col}`, (err) => {
            if(err && !err.message.includes('duplicate column name')) console.error(err);
        });
    });
});
db.close();
