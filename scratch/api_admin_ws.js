module.exports = function(app, io, db) {
    // Cookie-based Admin Auth Middleware
    const adminAuth = (req, res, next) => {
        if (req.cookies && req.cookies.admin_session === 'authenticated') {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    };

    // 1. Admin Login
    app.post('/api/admin/login', (req, res) => {
        const { password } = req.body;
        if (password === 'admin123') {
            res.cookie('admin_session', 'authenticated', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, error: 'Invalid password' });
        }
    });

    // Logout
    app.post('/api/admin/logout', (req, res) => {
        res.clearCookie('admin_session');
        res.json({ success: true });
    });

    // 2. Users list
    app.get('/api/admin/users', adminAuth, (req, res) => {
        const query = `
            SELECT id, telegram_id, email, display_name, wallet_address, balance_rub, usdt_balance, is_banned, role, is_verified_trader, created_at 
            FROM users
        `;
        db.all(query, [], (err, users) => {
            if (err) {
                console.error('Error fetching users:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json(users);
        });
    });

    // 3. User balance update
    app.post('/api/admin/users/:id/balance', adminAuth, (req, res) => {
        const { id } = req.params;
        
        let newBalance = req.body.rub_balance;
        if (newBalance === undefined) {
            newBalance = req.body.amount || req.body.balance || 0;
        }

        const amount = parseFloat(newBalance);
        if (isNaN(amount) || amount < 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        
        db.run('UPDATE users SET balance_rub = ? WHERE id = ?', [amount, id], function(err) {
            if (err) {
                console.error('Error updating balance:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({ success: true, newBalance: amount });
        });
    });

    // 4. Deals (P2P and general)
    app.get('/api/admin/deals', adminAuth, (req, res) => {
        db.all('SELECT * FROM p2p_deals', [], (err, deals) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json(deals);
        });
    });
    
    app.get('/api/admin/p2p_deals', adminAuth, (req, res) => {
        db.all('SELECT * FROM p2p_deals', [], (err, deals) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json(deals);
        });
    });

    // WebSockets Setup
    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        // Join Deal Room
        socket.on('join_deal', (dealId) => {
            socket.join(`p2p_deal_${dealId}`);
            console.log(`Socket ${socket.id} joined p2p_deal_${dealId}`);
        });

        // Join Admin Room
        socket.on('join_admin', () => {
            socket.join('admin_room');
            console.log(`Socket ${socket.id} joined admin_room`);
        });

        // Broadcast chat messages in deals
        socket.on('deal:chat_send', (data) => {
            const { dealId, message, sender } = data;
            if (dealId) {
                io.to(`p2p_deal_${dealId}`).emit('deal:chat_send', data);
            }
        });

        // Broadcast deal updates
        socket.on('deal:update', (data) => {
            if (data.dealId) {
                io.to(`p2p_deal_${data.dealId}`).emit('deal:update', data);
                io.to('admin_room').emit('deal:update', data);
            }
        });

        // Broadcast request freeze
        socket.on('admin:request_freeze', (data) => {
            io.to('admin_room').emit('admin:request_freeze', data);
        });
        
        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
};
