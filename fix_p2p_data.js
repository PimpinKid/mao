const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('crypto.db');

const baseNames = ['Alex', 'Igor', 'Max', 'Dmitry', 'Ivan', 'Sergey', 'Elena', 'Vadim', 'Anna', 'Roman', 'Mikhail', 'Pavel'];
const prefixes = ['Crypto', 'Exchange', 'P2P', 'TradeMaster', 'Pro', 'Bit', 'Coin', 'Trade', 'Hub', 'Ninja', 'Swap', 'Capital'];

function generateName() {
    const name = baseNames[Math.floor(Math.random() * baseNames.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return Math.random() > 0.5 ? `${name}_${prefix}` : `${prefix}_${name}`;
}

const banks = ['Сбербанк', 'Т-Банк', 'Альфа-Банк', 'Райффайзен', 'СБП'];

function all(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function run(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function fix() {
  console.log("Starting DB fix script...");
  
  // 1. Update all makers (users who have created ads or have strange names)
  // Strange names include those with timestamps (like _179) or empty
  const makers = await all(`
    SELECT DISTINCT u.id, u.display_name, u.telegram_username 
    FROM users u 
    WHERE u.id IN (SELECT maker_id FROM p2p_ads)
    OR u.display_name IS NULL 
    OR u.display_name = '' 
    OR u.display_name LIKE '%Трейдер%' 
    OR u.display_name LIKE '%test%'
    OR u.telegram_username LIKE '%179%'
  `);
  
  let updatedUsersCount = 0;
  for (const user of makers) {
      const newName = generateName();
      await run("UPDATE users SET display_name = ?, telegram_username = ? WHERE id = ?", [newName, '@' + newName, user.id]);
      updatedUsersCount++;
  }
  console.log(`Updated ${updatedUsersCount} users/makers with realistic names.`);
  
  let validMakers = await all("SELECT id FROM users WHERE id IN (SELECT maker_id FROM p2p_ads) LIMIT 20");
  if (validMakers.length === 0) {
      console.log("No valid makers found. Creating dummy makers...");
      for (let i = 0; i < 5; i++) {
          const newName = generateName();
          await run("INSERT INTO users (display_name, telegram_username, is_verified, is_verified_trader) VALUES (?, ?, 1, 1)", [newName, '@' + newName]);
      }
      validMakers = await all("SELECT id FROM users ORDER BY id DESC LIMIT 5");
  }

  // 2. Update existing p2p_ads payment methods
  const ads = await all("SELECT id, payment_methods FROM p2p_ads");
  let updatedAdsCount = 0;
  for (const ad of ads) {
      const count = Math.floor(Math.random() * 3) + 1; // 1 to 3 banks
      const selected = [];
      const banksCopy = [...banks];
      for (let i = 0; i < count; i++) {
          const idx = Math.floor(Math.random() * banksCopy.length);
          selected.push(banksCopy[idx]);
          banksCopy.splice(idx, 1);
      }
      await run("UPDATE p2p_ads SET payment_methods = ? WHERE id = ?", [JSON.stringify(selected), ad.id]);
      updatedAdsCount++;
  }
  console.log(`Randomized payment methods for ${updatedAdsCount} existing ads.`);

  // 3. Generate additional ads to meet the required minimums
  const cryptos = [
      { name: 'USDT', target: 8, priceBase: 95 },
      { name: 'BTC', target: 8, priceBase: 6500000 },
      { name: 'ETH', target: 5, priceBase: 300000 },
      { name: 'TON', target: 5, priceBase: 500 },
      { name: 'TRX', target: 5, priceBase: 12 }
  ];
  const types = ['buy', 'sell'];

  let generatedAdsCount = 0;
  for (const crypto of cryptos) {
      for (const type of types) {
          const rows = await all("SELECT count(*) as c FROM p2p_ads WHERE crypto = ? AND type = ?", [crypto.name, type]);
          const currentCount = rows[0].c;
          if (currentCount < crypto.target) {
              const toCreate = crypto.target - currentCount;
              for (let i = 0; i < toCreate; i++) {
                  const makerId = validMakers[Math.floor(Math.random() * validMakers.length)].id;
                  const price = crypto.priceBase * (1 + (Math.random() * 0.04 - 0.02)); // +/- 2%
                  const minLimit = Math.floor(Math.random() * 5000) + 1000;
                  const maxLimit = minLimit + Math.floor(Math.random() * 50000) + 10000;
                  const amountAvailable = maxLimit / price;
                  
                  const count = Math.floor(Math.random() * 3) + 1;
                  const selected = [];
                  const banksCopy = [...banks];
                  for (let j = 0; j < count; j++) {
                      const idx = Math.floor(Math.random() * banksCopy.length);
                      selected.push(banksCopy[idx]);
                      banksCopy.splice(idx, 1);
                  }
                  
                  await run(
                      "INSERT INTO p2p_ads (maker_id, type, crypto, fiat, price, min_limit, max_limit, payment_methods, status, available_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                      [makerId, type, crypto.name, 'RUB', parseFloat(price.toFixed(2)), minLimit, maxLimit, JSON.stringify(selected), 'active', amountAvailable]
                  );
                  generatedAdsCount++;
              }
          }
      }
  }
  console.log(`Generated ${generatedAdsCount} new ads to meet the minimum requirements.`);

  console.log("Database fixed successfully!");
  db.close();
}

fix().catch(err => console.error("Error running DB fix script:", err));
