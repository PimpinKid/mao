// Classic Exchange & Settings API Endpoints
// Assuming `app`, `authenticate`, `adminAuth`, `dbRun`, `dbGet`, `dbAll` are available in scope.

// Use an in-memory lock to prevent sqlite3 transaction interleaving on a shared connection
let orderMutex = Promise.resolve();

// 1. GET /api/reserves and GET /api/settings
app.get('/api/reserves', async (req, res) => {
    try {
        const row = await dbGet("SELECT value FROM settings WHERE key = 'reserves'");
        if (row && row.value) {
            res.json({ success: true, reserves: JSON.parse(row.value) });
        } else {
            res.json({ success: false, message: "Reserves not found" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

app.get('/api/settings', async (req, res) => {
    try {
        const rows = await dbAll("SELECT key, value FROM settings");
        const settings = {};
        for (const r of rows) {
            try { 
                settings[r.key] = JSON.parse(r.value); 
            } catch { 
                settings[r.key] = r.value; 
            }
        }
        res.json({ success: true, settings });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// 2. GET /api/user/orders (User exchange history)
app.get('/api/user/orders', authenticate, async (req, res) => {
    try {
        const rows = await dbAll("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [req.user.id]);
        res.json({ success: true, orders: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 3. POST /api/orders (Create classic exchange order)
app.post('/api/orders', authenticate, async (req, res) => {
    const { from_currency, to_currency, amount_give, amount_get, user_wallet, from_network, to_network } = req.body;
    const userId = req.user.id;
    
    const amtGet = parseFloat(amount_get);
    const amtGive = parseFloat(amount_give);

    if (isNaN(amtGet) || isNaN(amtGive) || amtGet <= 0 || amtGive <= 0) {
        return res.status(400).json({ success: false, message: "Invalid amount provided" });
    }

    const executeOrder = async () => {
        // P2P-Escrow-Architect Principle: ACID Atomicity
        // Using an explicit transaction (serialized by orderMutex to prevent Node async interleaving)
        await dbRun("BEGIN IMMEDIATE TRANSACTION");
        try {
            const reservesRow = await dbGet("SELECT value FROM settings WHERE key = 'reserves'");
            let reserves = {};
            if (reservesRow && reservesRow.value) {
                reserves = JSON.parse(reservesRow.value);
            }
            
            // Prevent overselling of reserves. If undefined, we assume unlimited.
            if (reserves[to_currency] !== undefined && reserves[to_currency] < amtGet) {
                 throw new Error("Insufficient pool reserves for this transaction");
            }
            
            if (reserves[to_currency] !== undefined) {
                reserves[to_currency] -= amtGet;
                await dbRun("UPDATE settings SET value = ? WHERE key = 'reserves'", [JSON.stringify(reserves)]);
            }
            
            // Find an active requisite to receive fiat/crypto
            const reqRow = await dbGet("SELECT * FROM service_requisites WHERE currency = ? AND is_active = 1 LIMIT 1", [from_currency]);
            const depositAddress = reqRow ? reqRow.account_number : null;

            const result = await dbRun(`
                INSERT INTO orders (
                    user_id, from_currency, to_currency, amount_give, amount_get, user_wallet, 
                    from_network, to_network, deposit_address, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
            `, [
                userId, from_currency, to_currency, amtGive, amtGet, 
                user_wallet, from_network, to_network, depositAddress
            ]);
            
            await dbRun("COMMIT");
            return { orderId: result.lastID, depositAddress };
        } catch (err) {
            try { await dbRun("ROLLBACK"); } catch (e) {}
            throw err;
        }
    };

    try {
        let result;
        const currentMutex = orderMutex;
        orderMutex = currentMutex.then(async () => {
            try {
                result = await executeOrder();
            } catch (err) {
                result = { error: err };
            }
        });
        await orderMutex;
        if (result && result.error) throw result.error;
        
        res.json({ success: true, orderId: result.orderId, depositAddress: result.depositAddress });
    } catch (err) {
        if (err.message === "Insufficient pool reserves for this transaction") {
            res.status(400).json({ success: false, message: err.message });
        } else {
            res.status(500).json({ success: false, message: err.message });
        }
    }
});

// 4. Admin Routes for Requisites (GET/POST/DELETE)
app.get('/api/admin/requisites', adminAuth, async (req, res) => {
    try {
        const rows = await dbAll("SELECT * FROM service_requisites");
        res.json({ success: true, requisites: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/admin/requisites', adminAuth, async (req, res) => {
    const { id, currency, bank_name, recipient_name, account_number, daily_limit, is_active } = req.body;
    try {
        if (id) {
            await dbRun(`
                UPDATE service_requisites 
                SET currency = ?, bank_name = ?, recipient_name = ?, account_number = ?, daily_limit = ?, is_active = ?
                WHERE id = ?
            `, [
                currency, 
                bank_name || null, 
                recipient_name || null, 
                account_number, 
                daily_limit || 500000, 
                is_active === undefined ? 1 : is_active, 
                id
            ]);
        } else {
            await dbRun(`
                INSERT INTO service_requisites (currency, bank_name, recipient_name, account_number, daily_limit, is_active)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                currency, 
                bank_name || null, 
                recipient_name || null, 
                account_number, 
                daily_limit || 500000, 
                is_active === undefined ? 1 : is_active
            ]);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete('/api/admin/requisites/:id', adminAuth, async (req, res) => {
    try {
        await dbRun("DELETE FROM service_requisites WHERE id = ?", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
