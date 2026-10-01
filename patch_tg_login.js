const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /async function loginWithTelegram\(\) \{[\s\S]*?async function connectWallet\(\)/;

const replacement = `async function loginWithTelegram() {
        const btns = document.querySelectorAll('#tg-login-btn, .btn-primary');
        btns.forEach(btn => btn.disabled = true);
        
        try {
            const socketId = socket ? socket.id : '';
            const res = await fetch('/api/auth/telegram-request?socketId=' + socketId);
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            
            window.open(data.botUrl, '_blank');
            showToast('Ожидаем подтверждения в Telegram...', 'info');
            
            // Re-enable buttons after 10s just in case
            setTimeout(() => { btns.forEach(btn => btn.disabled = false); }, 10000);
            
        } catch (e) {
            showToast('Ошибка: ' + e.message, 'error');
            btns.forEach(btn => btn.disabled = false);
        }
    }

    async function connectWallet()`;

code = code.replace(regex, replacement);

fs.writeFileSync('index.html', code);
console.log('Login logic patched');
