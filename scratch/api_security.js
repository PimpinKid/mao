const { generateSecret, verify, NobleCryptoPlugin, ScureBase32Plugin } = require('otplib');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');

// POST /api/auth/2fa/generate
app.post('/api/auth/2fa/generate', authenticate, async (req, res) => {
    try {
        const secret = generateSecret({ base32: new ScureBase32Plugin() });
        const email = req.user.email || 'user@example.com';
        const otpauth_url = `otpauth://totp/CryptoApp:${encodeURIComponent(email)}?secret=${secret}&issuer=CryptoApp`;
        
        await dbRun('UPDATE users SET two_factor_secret = ? WHERE id = ?', [secret, req.user.id]);
        
        const qr_code_url = await qrcode.toDataURL(otpauth_url);
        
        res.json({
            secret: secret,
            qr_code_url: qr_code_url
        });
    } catch (error) {
        console.error('Error generating 2FA secret:', error);
        res.status(500).json({ error: 'Failed to generate 2FA secret' });
    }
});

// POST /api/auth/2fa/enable
app.post('/api/auth/2fa/enable', authenticate, async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ error: 'Token is required' });

        const user = await dbGet('SELECT two_factor_secret FROM users WHERE id = ?', [req.user.id]);
        
        if (!user || !user.two_factor_secret) {
            return res.status(400).json({ error: '2FA not initialized' });
        }

        const result = await verify({ 
            token, 
            secret: user.two_factor_secret,
            crypto: new NobleCryptoPlugin(),
            base32: new ScureBase32Plugin()
        });

        if (result.valid) {
            await dbRun('UPDATE users SET two_factor_enabled = 1 WHERE id = ?', [req.user.id]);
            res.json({ message: '2FA enabled successfully' });
        } else {
            res.status(400).json({ error: 'Invalid 2FA token' });
        }
    } catch (error) {
        console.error('Error enabling 2FA:', error);
        res.status(500).json({ error: 'Failed to enable 2FA' });
    }
});

// GET /api/auth/telegram/init
app.get('/api/auth/telegram/init', async (req, res) => {
    try {
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        
        await dbRun('INSERT INTO auth_codes (code, expires_at, status) VALUES (?, ?, ?)', [code, expiresAt, 'pending']);

        const botUsername = 'CryptoAppMockBot';
        res.json({ 
            code, 
            bot_url: `https://t.me/${botUsername}?start=${code}` 
        });
    } catch (error) {
        console.error('Error initializing Telegram auth:', error);
        res.status(500).json({ error: 'Failed to initialize Telegram auth' });
    }
});

// GET /api/auth/telegram/check/:code
app.get('/api/auth/telegram/check/:code', async (req, res) => {
    try {
        const { code } = req.params;
        
        const authData = await dbGet('SELECT * FROM auth_codes WHERE code = ?', [code]);

        if (!authData) {
            return res.status(404).json({ error: 'Code not found' });
        }

        const now = new Date();
        const expires = new Date(authData.expires_at);
        if (now > expires) {
            return res.status(400).json({ error: 'Code expired' });
        }

        if (authData.status === 'verified' && authData.user_id) {
            const user = await dbGet('SELECT * FROM users WHERE id = ?', [authData.user_id]);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const jwtSecret = typeof JWT_SECRET !== 'undefined' ? JWT_SECRET : (process.env.JWT_SECRET || 'mao_exchange_super_secret_jwt_key_2025');
            const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' }); 
            
            await dbRun('DELETE FROM auth_codes WHERE code = ?', [code]);
            
            const returnUser = {
                id: user.id,
                email: user.email,
                display_name: user.display_name,
                wallet_address: user.wallet_address,
                usdt_balance: user.usdt_balance,
                role: user.role,
                balance_rub: user.balance_rub
            };

            return res.json({ status: 'success', token, user: returnUser });
        } else {
            return res.json({ status: 'pending' });
        }
    } catch (error) {
        console.error('Error checking Telegram auth code:', error);
        res.status(500).json({ error: 'Failed to check Telegram auth' });
    }
});
