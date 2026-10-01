const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

server = server.replace(
    /const message = data.message;/,
    "const message = data.message;\n                const ident = socket.userId ? String(socket.userId) : socket.guestId;"
);

fs.writeFileSync('server.js', server);
