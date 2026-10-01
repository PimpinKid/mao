const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const newRenderUser = `
        document.getElementById('ud-guest-content').style.display = 'none';
        document.getElementById('ud-auth-content').style.display = 'block';
        document.getElementById('ud-user-name').textContent = nameStr;
        document.getElementById('ud-user-id').textContent = user.id || '10492';
        document.getElementById('ud-user-initial').textContent = nameStr.charAt(0).toUpperCase();
        document.getElementById('reviewAuthWarning').style.display = 'none';

        const balDisplay = document.getElementById('header-balance-display');
        if (balDisplay) balDisplay.style.display = 'flex';
        const balRub = document.getElementById('header-balance-rub');
        if (balRub) balRub.textContent = parseFloat(user.balance_rub || 0).toFixed(2);
        const modalBalRub = document.getElementById('modal-balance-rub');
        if (modalBalRub) modalBalRub.textContent = parseFloat(user.balance_rub || 0).toFixed(2);
`;

content = content.replace(
    /document\.getElementById\('ud-guest-content'\)\.style\.display = 'none';[\s\S]*?document\.getElementById\('reviewAuthWarning'\)\.style\.display = 'none';/,
    newRenderUser
);

const newRenderGuest = `
        document.getElementById('ud-guest-content').style.display = 'block';
        document.getElementById('ud-auth-content').style.display = 'none';
        document.getElementById('reviewAuthWarning').style.display = 'none';

        const balDisplay = document.getElementById('header-balance-display');
        if (balDisplay) balDisplay.style.display = 'none';
`;

content = content.replace(
    /document\.getElementById\('ud-guest-content'\)\.style\.display = 'block';[\s\S]*?document\.getElementById\('reviewAuthWarning'\)\.style\.display = 'none';/,
    newRenderGuest
);

// Add Socket event listener for 'user:balance_update'
content = content.replace(
    "socket.on('user:wallet_update', (data) => {",
    "socket.on('user:balance_update', (data) => {\n            if (currentUser) {\n                currentUser.balance_rub = data.balance_rub;\n                const balRub = document.getElementById('header-balance-rub');\n                if (balRub) balRub.textContent = parseFloat(data.balance_rub).toFixed(2);\n                const modalBalRub = document.getElementById('modal-balance-rub');\n                if (modalBalRub) modalBalRub.textContent = parseFloat(data.balance_rub).toFixed(2);\n            }\n        });\n        socket.on('user:wallet_update', (data) => {"
);

fs.writeFileSync('index.html', content);
