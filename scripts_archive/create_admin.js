const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'crypto.db'));

async function createAdmin() {
    const email = 'admin@mao.exchange';
    const password = 'admin';
    const hash = await bcrypt.hash(password, 10);
    
    db.run(`
        INSERT OR REPLACE INTO users 
        (id, email, password_hash, telegram_id, telegram_username, phone, display_name, verification_status) 
        VALUES 
        (99999, ?, ?, '123456789', 'MaoAdmin', '+1234567890', 'MAO Admin', 'verified')
    `, [email, hash], function(err) {
        if (err) console.error("Error:", err);
        else console.log("Admin account created with email:", email, "and password:", password);
        db.close();
    });
}

createAdmin();
