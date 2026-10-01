const fs = require('fs');
let index = fs.readFileSync('index.html', 'utf8');
let server = fs.readFileSync('server.js', 'utf8');

// Strip out extensive Russian comments that might reveal the author
index = index.replace(/\/\* ========= FORM ELEMENTS RESET.*?======== \*\//g, '');
index = index.replace(/\/\* UI UX PRO MAX.*?\*\//g, '');
index = index.replace(/\/\* ОБНОВЛЕННЫЕ ПЛАШКИ.*?\*\//g, '');
index = index.replace(/\/\* TICKER HEADER \*\//g, '');
index = index.replace(/\/\* HEADER \*\//g, '');
index = index.replace(/\/\* FOOTER END \*\//g, '');
index = index.replace(/<!--.*?-->/g, ''); // all html comments

// server.js comments
server = server.replace(/\/\/ --- APP INITIALIZATION ---/g, '');
server = server.replace(/\/\/ ==========================================/g, '');
server = server.replace(/\/\/ API: FIAT DEPOSIT.*?/g, '');
server = server.replace(/\/\/ В реальном проекте здесь будет запись в таблицу/g, '');
server = server.replace(/\/\/ Отправляем админу уведомление/g, '');
server = server.replace(/\/\/ Глобальная функция для честной заморозки/g, '');

fs.writeFileSync('index.html', index);
fs.writeFileSync('server.js', server);
