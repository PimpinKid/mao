const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

server = server.replace(
    /const result = await dbRun\(\n\s*'INSERT INTO support_messages/,
    "const ident = socket.userId ? String(socket.userId) : socket.guestId;\n                const result = await dbRun(\n                    'INSERT INTO support_messages"
);

fs.writeFileSync('server.js', server);
