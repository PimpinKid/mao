const crmAdminAuth = (req, res, next) => {
    if (typeof adminAuth === 'function') {
        return adminAuth(req, res, next);
    } else if (typeof authenticate === 'function') {
        return authenticate(req, res, () => {
            if (req.user && req.user.role === 'admin') return next();
            res.status(403).json({ error: 'Forbidden: Admins only' });
        });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

const optionalAuth = (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        if (typeof authenticate === 'function') {
            return authenticate(req, res, next);
        }
    }
    next();
};

// POST /api/support/messages (юзер пишет в саппорт)
app.post('/api/support/messages', optionalAuth, async (req, res) => {
    try {
        const { message, guest_id } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        let userId = req.user ? req.user.id : null;
        let guestId = guest_id || null;
        
        if (!userId && !guestId) {
            return res.status(400).json({ error: 'User ID or Guest ID is required' });
        }

        await dbRun(
            `INSERT INTO support_messages (user_id, guest_id, sender, message) VALUES (?, ?, 'user', ?)`,
            [userId, guestId, message]
        );
        
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (err) {
        console.error('Error sending support message:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/admin/support/chats
app.get('/api/admin/support/chats', crmAdminAuth, async (req, res) => {
    try {
        const chats = await dbAll(`
            SELECT 
                user_id, 
                guest_id,
                message as last_message,
                sender as last_sender,
                MAX(created_at) as last_message_date,
                COUNT(id) as message_count
            FROM support_messages
            GROUP BY user_id, guest_id
            ORDER BY last_message_date DESC
        `);
        res.json({ success: true, chats });
    } catch (err) {
        console.error('Error fetching support chats:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/admin/support/messages/:chatId
app.get('/api/admin/support/messages/:chatId', crmAdminAuth, async (req, res) => {
    try {
        const { chatId } = req.params;
        let messages = [];

        let isUser = false;
        let isGuest = false;
        let idValue = chatId;

        if (chatId.startsWith('user_')) {
            isUser = true;
            idValue = chatId.replace('user_', '');
        } else if (chatId.startsWith('guest_')) {
            isGuest = true;
            idValue = chatId.replace('guest_', '');
        } else if (!isNaN(chatId)) {
            isUser = true;
        } else {
            isGuest = true;
        }

        if (isUser) {
            messages = await dbAll(
                `SELECT * FROM support_messages WHERE user_id = ? ORDER BY created_at ASC`,
                [idValue]
            );
        } else {
            messages = await dbAll(
                `SELECT * FROM support_messages WHERE guest_id = ? OR guest_id = ? ORDER BY created_at ASC`,
                [idValue, chatId]
            );
        }

        res.json({ success: true, messages });
    } catch (err) {
        console.error('Error fetching support messages:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/admin/users/:userId/ban
app.post('/api/admin/users/:userId/ban', crmAdminAuth, async (req, res) => {
    try {
        const { userId } = req.params;
        let banStatus = 1;

        if (req.body && typeof req.body.is_banned !== 'undefined') {
            banStatus = req.body.is_banned ? 1 : 0;
        } else {
            const user = await dbGet('SELECT is_banned FROM users WHERE id = ?', [userId]);
            if (user) {
                banStatus = user.is_banned ? 0 : 1;
            } else {
                return res.status(404).json({ error: 'User not found' });
            }
        }

        await dbRun(`UPDATE users SET is_banned = ? WHERE id = ?`, [banStatus, userId]);
        res.json({ success: true, message: banStatus ? 'User banned' : 'User unbanned' });
    } catch (err) {
        console.error('Error updating user ban status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/admin/users/:userId/verify_trader
app.post('/api/admin/users/:userId/verify_trader', crmAdminAuth, async (req, res) => {
    try {
        const { userId } = req.params;
        let verifyStatus = 1;

        if (req.body && typeof req.body.is_verified_trader !== 'undefined') {
            verifyStatus = req.body.is_verified_trader ? 1 : 0;
        } else {
            const user = await dbGet('SELECT is_verified_trader FROM users WHERE id = ?', [userId]);
            if (user) {
                verifyStatus = user.is_verified_trader ? 0 : 1;
            } else {
                return res.status(404).json({ error: 'User not found' });
            }
        }

        await dbRun(`UPDATE users SET is_verified_trader = ? WHERE id = ?`, [verifyStatus, userId]);
        res.json({ success: true, message: verifyStatus ? 'Trader verified' : 'Trader verification removed' });
    } catch (err) {
        console.error('Error updating trader verification status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/admin/reviews
app.get('/api/admin/reviews', crmAdminAuth, async (req, res) => {
    try {
        const status = req.query.status;
        let reviews = [];
        if (status) {
            reviews = await dbAll(`SELECT * FROM reviews WHERE status = ? ORDER BY created_at DESC`, [status]);
        } else {
            reviews = await dbAll(`SELECT * FROM reviews ORDER BY created_at DESC`);
        }
        res.json({ success: true, reviews });
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/admin/reviews/:id/approve
app.post('/api/admin/reviews/:id/approve', crmAdminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await dbRun(`UPDATE reviews SET status = 'approved' WHERE id = ?`, [id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json({ success: true, message: 'Review approved' });
    } catch (err) {
        console.error('Error approving review:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/admin/reviews/:id/delete
app.delete('/api/admin/reviews/:id/delete', crmAdminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await dbRun(`DELETE FROM reviews WHERE id = ?`, [id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json({ success: true, message: 'Review deleted' });
    } catch (err) {
        console.error('Error deleting review:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
