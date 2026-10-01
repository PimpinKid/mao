const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /socket\.on\('connect', \(\) => \{/;

const replacement = `socket.on('connect', () => {
        socket.on('telegram:auth_success', (data) => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                showToast('Успешная авторизация!', 'success');
                setTimeout(() => window.location.reload(), 1500);
            }
        });`;

code = code.replace(regex, replacement);

fs.writeFileSync('index.html', code);
console.log('Socket listener patched');
