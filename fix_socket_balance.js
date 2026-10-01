const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const newEvent = `
        socket.on('user:balance_update', (data) => {
            if (currentUser) {
                currentUser.balance_rub = data.balance_rub;
                const balRub = document.getElementById('header-balance-rub');
                if (balRub) balRub.textContent = parseFloat(data.balance_rub).toFixed(2);
                const modalBalRub = document.getElementById('modal-balance-rub');
                if (modalBalRub) modalBalRub.textContent = parseFloat(data.balance_rub).toFixed(2);
            }
        });
`;

if (!content.includes('user:balance_update')) {
    content = content.replace(
        "socket.on('connect', () => {",
        "socket.on('connect', () => {" + newEvent
    );
    fs.writeFileSync('index.html', content);
}
