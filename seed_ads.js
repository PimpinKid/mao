const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'crypto.db');
const db = new sqlite3.Database(dbPath);

const popularCrypto = ['USDT', 'BTC'];
const lessPopularCrypto = ['ETH', 'TON', 'TRX', 'XMR', 'USDC'];
const paymentMethodPool = ['Сбербанк', 'Т-Банк', 'Альфа-Банк', 'Райффайзен', 'СБП'];

const prices = {
  'USDT': { min: 98, max: 102 },
  'USDC': { min: 98, max: 102 },
  'BTC': { min: 6400000, max: 6700000 },
  'ETH': { min: 240000, max: 270000 },
  'TON': { min: 450, max: 550 },
  'TRX': { min: 10, max: 14 },
  'XMR': { min: 14000, max: 16000 }
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPrice(crypto) {
  const range = prices[crypto];
  return (Math.random() * (range.max - range.min) + range.min).toFixed(2);
}

function getRandomPaymentMethods() {
  const count = getRandomInt(1, 3);
  const shuffled = [...paymentMethodPool].sort(() => 0.5 - Math.random());
  return JSON.stringify(shuffled.slice(0, count));
}

db.serialize(() => {
  // Select up to 30 most recent makers (Subagent 1 creates 25-30 users).
  db.all("SELECT id FROM users ORDER BY id DESC LIMIT 30", [], (err, rows) => {
    if (err) {
      console.error('Error fetching makers:', err);
      process.exit(1);
    }
    
    const makerIds = rows.map(r => r.id);
    if (makerIds.length === 0) {
      console.error("No makers found in DB. Make sure to run seed_makers.js first.");
      process.exit(1);
    }

    const insertAd = db.prepare(`
      INSERT INTO p2p_ads 
      (maker_id, type, crypto, fiat, price, min_limit, max_limit, payment_methods, status, available_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let count = 0;

    const generateAdsForType = (crypto, minCards, maxCards, type) => {
      const numAds = getRandomInt(minCards, maxCards);
      for(let i = 0; i < numAds; i++) {
        const maker_id = makerIds[getRandomInt(0, makerIds.length - 1)];
        const fiat = 'RUB';
        const price = parseFloat(getRandomPrice(crypto));
        // Random logical limits
        const min_limit = getRandomInt(1, 15) * 1000;
        const max_limit = getRandomInt(min_limit / 1000 + 10, 500) * 1000; 
        const payment_methods = getRandomPaymentMethods();
        const status = 'active'; 
        const available_amount = parseFloat((max_limit / price).toFixed(4));

        insertAd.run(maker_id, type, crypto, fiat, price, min_limit, max_limit, payment_methods, status, available_amount);
        count++;
      }
    };

    const generateAds = (crypto, minCards, maxCards) => {
      generateAdsForType(crypto, minCards, maxCards, 'buy');
      generateAdsForType(crypto, minCards, maxCards, 'sell');
    };

    // Popular crypto: 6-10 cards per type
    popularCrypto.forEach(crypto => {
      generateAds(crypto, 6, 10);
    });

    // Less popular crypto: 3-5 cards per type
    lessPopularCrypto.forEach(crypto => {
      generateAds(crypto, 3, 5);
    });

    insertAd.finalize(() => {
      console.log(`Successfully generated ${count} P2P ads.`);
      db.close();
    });
  });
});
