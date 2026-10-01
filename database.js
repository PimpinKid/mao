const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const crypto = require('crypto');

const dbPath = path.resolve(__dirname, 'crypto.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (!err) {
        db.run('PRAGMA journal_mode = WAL;');
        db.run('PRAGMA synchronous = NORMAL;');
    }
});

// Инициализация структуры таблиц базы данных
db.serialize(() => {
    // Создание таблицы, если её нет
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            telegram_id TEXT UNIQUE,
            telegram_username TEXT,
            display_name TEXT,
            email TEXT UNIQUE,
            password_hash TEXT,
            phone TEXT,
            auth_provider TEXT DEFAULT 'local',
            verification_status TEXT DEFAULT 'verified',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Авто-миграция: гарантирует наличие всех колонок в старой БД без её удаления
    const migrations = [
        `ALTER TABLE users ADD COLUMN telegram_id TEXT`,
        `ALTER TABLE users ADD COLUMN telegram_username TEXT`,
        `ALTER TABLE users ADD COLUMN display_name TEXT`,
        `ALTER TABLE users ADD COLUMN email TEXT`,
        `ALTER TABLE users ADD COLUMN password_hash TEXT`,
        `ALTER TABLE users ADD COLUMN phone TEXT`,
        `ALTER TABLE users ADD COLUMN auth_provider TEXT DEFAULT 'local'`,
        `ALTER TABLE users ADD COLUMN verification_status TEXT DEFAULT 'verified'`,
        `ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 1`,
        `ALTER TABLE users ADD COLUMN is_verified_trader INTEGER DEFAULT 0`,
        `ALTER TABLE users ADD COLUMN is_banned INTEGER DEFAULT 0`,
        `ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`
    ];
    migrations.forEach(query => db.run(query, () => {}));

    // Таблица кодов подтверждения Email
    db.run(`
        CREATE TABLE IF NOT EXISTS email_codes (
            email TEXT PRIMARY KEY,
            code TEXT,
            password_hash TEXT,
            expires_at INTEGER
        )
    `);

    // Таблица кодов авторизации Telegram
    db.run(`
        CREATE TABLE IF NOT EXISTS auth_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            user_id INTEGER,
            expires_at DATETIME NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // Таблица ордеров (заявок на обмен)
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            guest_id TEXT,
            from_currency TEXT,
            to_currency TEXT,
            from_network TEXT,
            to_network TEXT,
            amount_give REAL,
            amount_get REAL,
            user_wallet TEXT,
            deposit_address TEXT,
            status TEXT DEFAULT 'new',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    const orderMigrations = [
        `ALTER TABLE orders ADD COLUMN guest_id TEXT`,
        `ALTER TABLE orders ADD COLUMN from_network TEXT`,
        `ALTER TABLE orders ADD COLUMN to_network TEXT`,
        `ALTER TABLE orders ADD COLUMN deposit_address TEXT`
    ];
    orderMigrations.forEach(query => db.run(query, () => {}));

    // Таблица пула реквизитов сервиса (карты и кошельки для приема)
    db.run(`
        CREATE TABLE IF NOT EXISTS service_requisites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            currency TEXT NOT NULL,
            bank_name TEXT,
            recipient_name TEXT,
            account_number TEXT NOT NULL,
            daily_limit REAL DEFAULT 500000,
            current_turnover REAL DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Сидирование базовых реквизитов если пусто
    db.get("SELECT COUNT(*) as count FROM service_requisites", (err, row) => {
        if (!err && (!row || row.count === 0)) {
            const initialReqs = [
                ['RUB', 'Сбербанк', 'Дмитрий К.', '2202 2032 4455 6677', 500000, 142000, 1],
                ['RUB', 'Т-Банк', 'Алексей М.', '5536 9140 1234 5678', 500000, 85000, 1],
                ['USDT', 'TRC-20', 'Hot Wallet #1', 'TYDzsYUEpvnYmQk4zGP9sWWcTEd36dAtW6', 10000000, 45000, 1],
                ['BTC', 'Bitcoin Network', 'Vault Cold-1', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 50000000, 0, 1]
            ];
            const stmt = db.prepare("INSERT INTO service_requisites (currency, bank_name, recipient_name, account_number, daily_limit, current_turnover, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)");
            initialReqs.forEach(r => stmt.run(r));
            stmt.finalize();
        }
    });

    // Таблица тикетов/чата поддержки
    db.run(`
        CREATE TABLE IF NOT EXISTS support_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            guest_id TEXT,
            sender TEXT,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    db.run(`ALTER TABLE support_messages ADD COLUMN guest_id TEXT`, () => {});

    // Таблица отзывов клиентов
    db.run(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            author TEXT NOT NULL,
            text TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Таблица настроек (маржа, отключенные валюты)
    db.run(`
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    `);

    // Сидирование 50 отзывов с датами от 25 декабря с шагом к текущему дню
    const seedReviews = [
        "кароч менял usdt на сбер, очковал сначала ппц) но все за 5 мин прилетело, спс!",
        "хз че писать все четко и быстро",
        "первый раз в жизни менял бтк, думал скамнут кароч. в итоге 7 минут и деньги на карте. топчик🔥",
        "оч очковал сначала если честно) сумма не маленькая была. но все ровно, за 10 мин пришли",
        "пушка просто, за 3 мин троны прилетели",
        "менял тон на рубли, курс норм, без задержек. буду юзать",
        "кароч сервису респект, меняю 3 раз уже, все залетает мгновенно",
        "чисто за 5 мин вывели на тбанк, спс оператору в чате быстро ответил",
        "по началу ссыковато было сбер светить, но пришли одним переводом без всякой дичи. респект!",
        "блин оч круто, думал долго будет а тут пару минут и готово))",
        "хз все пишут скам скам в инете про обменники, а тут реально быстро)",
        "курс оч порадовал сегодня, спс за обмен",
        "менял usdt trc20 на карту, за 6 минут все упало. имба",
        "очковал капец когда заявку создавал, но поддержка успокоила в чате) всё пришло, спс",
        "кароч всё найс, перевели за 5 мин",
        "топ обменник, теперь только тут менять буду",
        "не ожидал что так быстро) буквально за пару минут пришли монеты",
        "хз че написать) быстро удобно курс норм",
        "первый раз менял тут, вообще интуитивно всё понятно, кароч респект!",
        "менял 10к руб на бтк, пришли без траблов",
        "ваще огонь, за 4 минуты юсдт на кошель упали🔥",
        "саппорт красавчик оч быстро ответил на тупой вопрос))",
        "очковал из за блокировок сбера, но пришло 1 переводом, всё ровно",
        "кароч ровный обменник, меняю тут постоянно",
        "от души пацаны все быстро",
        "курс реально шикарный был, не удержался)) все быстро пришло",
        "менял sol на рубли, 5 минут и деньги на карте",
        "хз очковал ппц но вы лучшие спс)",
        "быстро, четко, без лишней муеты. 10/10",
        "первый раз юзаю этот сайт, все оч понятно и быстро",
        "кароч 100 юсдт за 5 мин упали на карту, норм",
        "поддержка оч приятная, помогли когда тупанул с реквизитами",
        "супееер, быстро и курс пушка",
        "менял trx на карту, всё прилетело мгновенно",
        "очковал немного тк сумма большая была, но всё перевели за 10 мин, спс!",
        "топчик, рекомендую",
        "быстрый обмен без гемора, сяп",
        "с первого раза все получилось, сервис кайф",
        "хз че добавить, все пришло быстро и по норм курсу",
        "меняю тут второй раз, ваще без лагов и задержек",
        "кароч зашел, обменял, вышел. 5 минут времени, огонь!",
        "первй раз крипту менял, ссыковато было пипец) но всё пришло!",
        "курс лучше чем на бесте был сегодня, спс",
        "ровно все, за 7 минут рубли на тбанке",
        "оч очковал из-за отзывов на другие сайты, но тут всё честно",
        "кароч сервис огонь, спасибки!",
        "менял xmr на ton, упали сразу на кошель, кайф",
        "все найс спс",
        "саппорт мгновенно ответил в чате, за это отдельный респект",
        "пушка гонка за 3 минуты все прилетело❤️"
    ];

    db.get("SELECT COUNT(*) as count FROM reviews", (err, row) => {
        // Если база пустая или меньше 50 записей, перезасеиваем 50 отзывов с точными датами
        if (!err && (!row || row.count < 50)) {
            db.run("DELETE FROM reviews WHERE user_id = 0");
            const startTime = new Date('2025-12-25T10:00:00Z').getTime();
            const endTime = Date.now();
            const total = seedReviews.length;
            const stmt = db.prepare("INSERT INTO reviews (user_id, author, text, status, created_at) VALUES (0, ?, ?, 'approved', ?)");
            
            // seedReviews[0] — самый свежий (endTime), seedReviews[49] — самый старый (25 декабря)
            seedReviews.forEach((rev, idx) => {
                const itemTime = new Date(endTime - (idx * (endTime - startTime) / (total - 1)));
                const dateStr = itemTime.toISOString().replace('T', ' ').slice(0, 19);
                stmt.run(`Клиент #${10420 + idx}`, rev, dateStr);
            });
            stmt.finalize();
        }
    });

    // Таблица кошельков
    db.run(`
        CREATE TABLE IF NOT EXISTS wallets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            currency TEXT NOT NULL,
            balance REAL DEFAULT 0.0,
            address TEXT UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // Таблица P2P объявлений мейкеров
    db.run(`
        CREATE TABLE IF NOT EXISTS p2p_ads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            maker_id INTEGER,
            type TEXT,
            crypto TEXT,
            fiat TEXT,
            price REAL,
            min_limit REAL,
            max_limit REAL,
            payment_methods TEXT,
            status TEXT DEFAULT 'pending',
            admin_comment TEXT,
            available_amount REAL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => { if(err) console.error("Error creating p2p_ads:", err); });

    db.run(`ALTER TABLE p2p_ads ADD COLUMN available_amount REAL DEFAULT 0`, () => {});

    // Таблица P2P сделок
    db.run(`
        CREATE TABLE IF NOT EXISTS p2p_deals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ad_id INTEGER,
            taker_id INTEGER,
            amount_fiat REAL,
            amount_crypto REAL,
            maker_name TEXT,
            rate REAL,
            asset TEXT,
            fiat TEXT,
            type TEXT,
            status TEXT DEFAULT 'open',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ad_id) REFERENCES p2p_ads(id),
            FOREIGN KEY (taker_id) REFERENCES users(id)
        )
    `, (err) => { if(err) console.error("Error creating p2p_deals:", err); });

    db.run(`ALTER TABLE p2p_deals ADD COLUMN dispute_status TEXT DEFAULT 'none'`, () => {});
    db.run(`ALTER TABLE p2p_deals ADD COLUMN ad_id INTEGER`, () => {});
    db.run(`ALTER TABLE p2p_deals ADD COLUMN escrow_step TEXT DEFAULT 'created'`, () => {});

    // Таблица сообщений в P2P сделках
    db.run(`
        CREATE TABLE IF NOT EXISTS p2p_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            deal_id INTEGER,
            sender_type TEXT,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (deal_id) REFERENCES p2p_deals(id)
        )
    `, (err) => { if(err) console.error("Error creating p2p_messages:", err); });

    // Таблица P2P ордеров
    db.run(`
        CREATE TABLE IF NOT EXISTS p2p_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            crypto_currency TEXT NOT NULL,
            fiat_currency TEXT NOT NULL,
            amount REAL NOT NULL,
            price REAL NOT NULL,
            status TEXT DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `, (err) => { if(err) console.error("Error creating p2p_orders:", err); });

    // Таблица транзакций
    db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            currency TEXT NOT NULL,
            status TEXT DEFAULT 'completed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // Таблица логов действий пользователя
    db.run(`
        CREATE TABLE IF NOT EXISTS action_logs (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            action_type TEXT,
            description TEXT,
            ip_address TEXT DEFAULT 'unknown',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`ALTER TABLE action_logs ADD COLUMN ip_address TEXT DEFAULT 'unknown'`, (err) => {
        // Ignore error if column already exists
    });
});

// Вспомогательные Promise-обертки для SQL
function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

module.exports = {
    db,
    dbRun,
    dbGet,
    dbAll
};
