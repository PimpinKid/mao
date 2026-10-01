module.exports = function(app, dbRun, dbGet, dbAll) {

    // Helper for transactions
    const runInTx = async (callback) => {
        // Simple serialization since we don't have a guaranteed connection pool
        // This is a naive lock to prevent overlapping BEGIN/COMMIT
        if (!global.txLock) {
            global.txLock = Promise.resolve();
        }
        
        let releaseLock;
        const lock = new Promise(resolve => releaseLock = resolve);
        const oldLock = global.txLock;
        global.txLock = global.txLock.then(() => lock);
        
        await oldLock;
        try {
            await dbRun("BEGIN IMMEDIATE TRANSACTION");
            const result = await callback();
            await dbRun("COMMIT");
            return result;
        } catch (e) {
            try { await dbRun("ROLLBACK"); } catch(err) {}
            throw e;
        } finally {
            releaseLock();
        }
    };

    // 1. Create Ad
    app.post('/api/p2p/ads', async (req, res) => {
        try {
            const userId = req.user.id;
            const { type, crypto, fiat, price, min_limit, max_limit, payment_methods, available_amount } = req.body;
            
            await runInTx(async () => {
                if (type === 'sell') {
                    // Maker is selling crypto. Freeze balance.
                    const user = await dbGet('SELECT usdt_balance FROM users WHERE id = ?', [userId]);
                    if (!user || user.usdt_balance < available_amount) {
                        throw new Error('Insufficient balance');
                    }
                    await dbRun('UPDATE users SET usdt_balance = usdt_balance - ? WHERE id = ?', [available_amount, userId]);
                }
                
                const query = `
                    INSERT INTO p2p_ads (maker_id, type, crypto, fiat, price, min_limit, max_limit, payment_methods, available_amount, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
                `;
                await dbRun(query, [userId, type, crypto, fiat, price, min_limit, max_limit, JSON.stringify(payment_methods), available_amount]);
            });
            
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // 2. Get active Ads
    app.get('/api/p2p/ads', async (req, res) => {
        try {
            const ads = await dbAll(`SELECT * FROM p2p_ads WHERE status = 'active'`);
            res.json(ads || []);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // 3. Get My Ads
    app.get('/api/p2p/my-ads', async (req, res) => {
        try {
            const userId = req.user.id;
            const ads = await dbAll(`SELECT * FROM p2p_ads WHERE maker_id = ? AND status != 'deleted'`, [userId]);
            res.json(ads || []);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // 4. Delete Ad
    app.delete('/api/p2p/ads/:id', async (req, res) => {
        try {
            const userId = req.user.id;
            const adId = req.params.id;
            
            await runInTx(async () => {
                const ad = await dbGet('SELECT * FROM p2p_ads WHERE id = ? AND maker_id = ? AND status != \'deleted\'', [adId, userId]);
                if (!ad) throw new Error('Ad not found');
                
                if (ad.type === 'sell' && ad.available_amount > 0) {
                    // Refund remaining crypto
                    await dbRun('UPDATE users SET usdt_balance = usdt_balance + ? WHERE id = ?', [ad.available_amount, userId]);
                }
                
                await dbRun(`UPDATE p2p_ads SET status = 'deleted', available_amount = 0 WHERE id = ?`, [adId]);
            });
            
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // 5. Toggle Ad Status
    app.post('/api/p2p/ads/:id/toggle', async (req, res) => {
        try {
            const userId = req.user.id;
            const adId = req.params.id;
            
            const ad = await dbGet('SELECT * FROM p2p_ads WHERE id = ? AND maker_id = ?', [adId, userId]);
            if (!ad) return res.status(404).json({ success: false, error: 'Ad not found' });
            if (ad.status === 'deleted') return res.status(400).json({ success: false, error: 'Ad is deleted' });
            
            const newStatus = ad.status === 'active' ? 'inactive' : 'active';
            await dbRun('UPDATE p2p_ads SET status = ? WHERE id = ?', [newStatus, adId]);
            
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // 6. Open Deal
    app.post('/api/p2p/deals', async (req, res) => {
        try {
            const takerId = req.user.id;
            const { ad_id, amount_fiat, amount_crypto } = req.body;
            let resultId;
            
            await runInTx(async () => {
                const ad = await dbGet('SELECT * FROM p2p_ads WHERE id = ? AND status = \'active\'', [ad_id]);
                if (!ad) throw new Error('Ad not found or inactive');
                if (ad.maker_id === takerId) throw new Error('Cannot take your own ad');
                
                if (ad.type === 'sell') {
                    // Maker sells crypto. Take from ad.available_amount
                    if (ad.available_amount < amount_crypto) {
                        throw new Error('Not enough crypto available in this ad');
                    }
                    await dbRun('UPDATE p2p_ads SET available_amount = available_amount - ? WHERE id = ?', [amount_crypto, ad.id]);
                } else if (ad.type === 'buy') {
                    // Maker buys crypto, meaning Taker sells crypto. Freeze from taker.
                    const taker = await dbGet('SELECT usdt_balance FROM users WHERE id = ?', [takerId]);
                    if (!taker || taker.usdt_balance < amount_crypto) {
                        throw new Error('Insufficient crypto balance');
                    }
                    await dbRun('UPDATE users SET usdt_balance = usdt_balance - ? WHERE id = ?', [amount_crypto, takerId]);
                }
                
                const maker = await dbGet('SELECT display_name FROM users WHERE id = ?', [ad.maker_id]);
                const dealType = ad.type === 'buy' ? 'sell' : 'buy'; // from Taker's perspective
                
                const query = `
                    INSERT INTO p2p_deals (ad_id, taker_id, amount_fiat, amount_crypto, status, escrow_step, maker_name, rate, asset, fiat, type)
                    VALUES (?, ?, ?, ?, 'open', 'created', ?, ?, ?, ?, ?)
                `;
                const result = await dbRun(query, [
                    ad.id, takerId, amount_fiat, amount_crypto,
                    maker ? maker.display_name : 'Maker', ad.price, ad.crypto, ad.fiat, dealType
                ]);
                resultId = result.lastID;
            });
            
            res.json({ success: true, deal_id: resultId });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // 7. Get My Deals
    app.get('/api/p2p/my-deals', async (req, res) => {
        try {
            const userId = req.user.id;
            const deals = await dbAll(`
                SELECT d.*, a.type as ad_type, a.maker_id 
                FROM p2p_deals d
                JOIN p2p_ads a ON d.ad_id = a.id
                WHERE d.taker_id = ? OR a.maker_id = ?
            `, [userId, userId]);
            res.json(deals || []);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // 8. Get specific deal
    app.get('/api/p2p/deals/:id', async (req, res) => {
        try {
            const dealId = req.params.id;
            const deal = await dbGet(`
                SELECT d.*, a.type as ad_type, a.maker_id, a.payment_methods
                FROM p2p_deals d
                JOIN p2p_ads a ON d.ad_id = a.id
                WHERE d.id = ?
            `, [dealId]);
            if (!deal) return res.status(404).json({ success: false, error: 'Deal not found' });
            res.json(deal);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // 9. Deal Messages (Chat)
    app.get('/api/p2p/deals/:id/messages', async (req, res) => {
        try {
            const messages = await dbAll('SELECT * FROM p2p_messages WHERE deal_id = ? ORDER BY created_at ASC', [req.params.id]);
            res.json(messages || []);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    app.post('/api/p2p/deals/:id/messages', async (req, res) => {
        try {
            const { text } = req.body;
            if (!text) return res.status(400).json({ success: false, error: 'Empty message' });
            
            const dealId = req.params.id;
            const userId = req.user.id;
            
            const deal = await dbGet('SELECT d.taker_id, a.maker_id FROM p2p_deals d JOIN p2p_ads a ON d.ad_id = a.id WHERE d.id = ?', [dealId]);
            if (!deal) return res.status(404).json({ success: false, error: 'Deal not found' });
            
            let senderType = 'user';
            if (deal.taker_id === userId) senderType = 'taker';
            else if (deal.maker_id === userId) senderType = 'maker';
            
            await dbRun('INSERT INTO p2p_messages (deal_id, sender_type, message) VALUES (?, ?, ?)', [dealId, senderType, text]);
            
            // Broadcast via Socket.IO if available
            if (req.io) {
                req.io.to('p2p_deal_' + dealId).emit('deal:chat_send', { sender: senderType, message: text });
            }
            
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // 10. File upload dummy
    app.post('/api/p2p/deals/:id/upload', async (req, res) => {
        res.json({ success: true, url: '/dummy-upload.jpg' });
    });

    // 11. Deal Status actions
    app.post('/api/p2p/deals/:id/paid', async (req, res) => {
        try {
            const dealId = req.params.id;
            await runInTx(async () => {
                const deal = await dbGet('SELECT status FROM p2p_deals WHERE id = ?', [dealId]);
                if (!deal || deal.status !== 'open') throw new Error('Deal cannot be marked as paid');
                await dbRun('UPDATE p2p_deals SET status = \'paid\', escrow_step = \'paid\' WHERE id = ?', [dealId]);
            });
            if (req.io) req.io.to('p2p_deal_' + dealId).emit('deal:update', { status: 'paid' });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    app.post('/api/p2p/deals/:id/dispute', async (req, res) => {
        try {
            const dealId = req.params.id;
            await dbRun('UPDATE p2p_deals SET dispute_status = \'open\' WHERE id = ?', [dealId]);
            if (req.io) {
                req.io.to('p2p_deal_' + dealId).emit('deal:update', { dispute_status: 'open' });
                req.io.to('admin_room').emit('admin:request_freeze', { dealId });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    app.post('/api/p2p/deals/:id/cancel', async (req, res) => {
        try {
            const dealId = req.params.id;
            await runInTx(async () => {
                const deal = await dbGet('SELECT d.*, a.type as ad_type FROM p2p_deals d JOIN p2p_ads a ON d.ad_id = a.id WHERE d.id = ?', [dealId]);
                if (!deal || deal.status !== 'open') throw new Error('Cannot cancel deal');
                
                if (deal.ad_type === 'buy') {
                    // Taker sells crypto, refund Taker
                    await dbRun('UPDATE users SET usdt_balance = usdt_balance + ? WHERE id = ?', [deal.amount_crypto, deal.taker_id]);
                } else if (deal.ad_type === 'sell') {
                    // Maker sells crypto, refund back to Ad available_amount
                    await dbRun('UPDATE p2p_ads SET available_amount = available_amount + ? WHERE id = ?', [deal.amount_crypto, deal.ad_id]);
                }
                
                await dbRun('UPDATE p2p_deals SET status = \'cancelled\', escrow_step = \'cancelled\' WHERE id = ?', [dealId]);
            });
            if (req.io) req.io.to('p2p_deal_' + dealId).emit('deal:update', { status: 'cancelled' });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    app.post('/api/p2p/deals/:id/release', async (req, res) => {
        try {
            const dealId = req.params.id;
            await runInTx(async () => {
                const deal = await dbGet('SELECT d.*, a.type as ad_type, a.maker_id FROM p2p_deals d JOIN p2p_ads a ON d.ad_id = a.id WHERE d.id = ?', [dealId]);
                if (!deal || deal.status === 'completed' || deal.status === 'cancelled') throw new Error('Cannot release crypto for this deal');
                
                // Release crypto to the buyer
                let buyerId;
                if (deal.ad_type === 'sell') {
                    // Maker sold, Taker bought
                    buyerId = deal.taker_id;
                } else if (deal.ad_type === 'buy') {
                    // Maker bought, Taker sold
                    buyerId = deal.maker_id;
                }
                
                await dbRun('UPDATE users SET usdt_balance = usdt_balance + ? WHERE id = ?', [deal.amount_crypto, buyerId]);
                await dbRun('UPDATE p2p_deals SET status = \'completed\', escrow_step = \'released\' WHERE id = ?', [dealId]);
            });
            if (req.io) req.io.to('p2p_deal_' + dealId).emit('deal:update', { status: 'completed' });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
};
