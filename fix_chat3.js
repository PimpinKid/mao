const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

const target = `const result = await dbRun(
                    'INSERT INTO support_messages (user_id, guest_id, sender, message) VALUES (?, ?, ?, ?)',
                    [socket.userId || 0, socket.guestId, 'user', message.trim()]
                );`;

const replacement = `const ident = socket.userId ? String(socket.userId) : socket.guestId;
                const result = await dbRun(
                    'INSERT INTO support_messages (user_id, guest_id, sender, message) VALUES (?, ?, ?, ?)',
                    [socket.userId || 0, socket.guestId, 'user', message.trim()]
                );`;

server = server.replace(target, replacement);
fs.writeFileSync('server.js', server);
