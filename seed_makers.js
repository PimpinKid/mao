const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./crypto.db');

const makerNames = [
    'CryptoFast', 'TetherKing', 'Mao_Exchange_Pro', 'TrustTrade', 'BTC_Express',
    'CoinFlip', 'RapidEx', 'SecureSwap', 'SatoshiPoint', 'BitFlow',
    'JetCrypto', 'P2P_Ninja', 'TradePro', 'GigaEx', 'WhaleTrader',
    'AlphaChange', 'OmegaP2P', 'FastCoin', 'Stable_House', 'QuickSatoshi',
    'EasyTether', 'MoonTrade', 'Global_Ex', 'LocalBit', 'TrustCoin',
    'Instant_Exchange', 'MegaSwap', 'CryptoHub', 'NextGen_P2P', 'SolidTrade'
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

db.serialize(() => {
    const insertUser = db.prepare(`
        INSERT INTO users (
            display_name, telegram_id, email, password_hash, telegram_username, phone, 
            auth_provider, verification_status, is_verified, is_verified_trader, role
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertDeal = db.prepare(`
        INSERT INTO p2p_deals (
            maker_name, taker_id, amount_fiat, amount_crypto, status, asset, fiat, type, dispute_status, escrow_step
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    db.run("BEGIN TRANSACTION");

    const usersToCreate = getRandomInt(25, 30);
    const selectedNames = [...makerNames].sort(() => 0.5 - Math.random()).slice(0, usersToCreate);

    selectedNames.forEach((name, index) => {
        const dealsCount = getRandomInt(20, 800);
        const isVerifiedTrader = dealsCount > 150 ? 1 : 0;
        
        const uniqueSuffix = Date.now().toString() + '_' + getRandomInt(1000, 9999);
        
        insertUser.run(
            name, 
            `tg_${uniqueSuffix}`, 
            `maker_${uniqueSuffix}@example.com`, 
            'hashedpassword', 
            `@${name}_${uniqueSuffix}`, 
            `+10000000${getRandomInt(1000, 9999)}`, 
            'local', 
            'verified', 
            1, 
            isVerifiedTrader, 
            'user'
        );

        for (let i = 0; i < dealsCount; i++) {
            insertDeal.run(
                name,
                getRandomInt(1, 1000), // dummy taker_id
                getRandomInt(1000, 50000), // amount_fiat
                Math.random() * 5, // amount_crypto
                'completed',
                ['USDT', 'BTC', 'ETH'][getRandomInt(0, 2)],
                'RUB',
                ['buy', 'sell'][getRandomInt(0, 1)],
                'none',
                'released'
            );
        }
    });

    insertUser.finalize();
    insertDeal.finalize();

    db.run("COMMIT", (err) => {
        if (err) {
            console.error("Error committing transaction:", err);
        } else {
            console.log(`Successfully seeded ${usersToCreate} makers with deals.`);
        }
        db.close();
    });
});
