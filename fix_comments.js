const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

server = server.replace(/\/\/ ===.*?===/g, '');
server = server.replace(/\/\/ ==========================================/g, '');

fs.writeFileSync('server.js', server);
