const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const regex = /dbRun\("INSERT INTO reviews \[\s\S\]*?\}\);\s*\}\);/;
// Let's just fix it by replacing the exact broken chunk.
const brokenChunk = `dbRun("INSERT INTO reviews (user_id, author, text, status) VALUES (?, ?, ?, 'pending')", 
        [req.user.id, req.user.username || 'Пользователь', text.trim()], function(err) {
        if (err) return res.status(500).json({ error: 'DB Error' });
        res.json({ success: true, message: 'Review submitted for moderation' });
    });
});`;
code = code.replace(brokenChunk, '');

fs.writeFileSync('server.js', code);
console.log('Syntax error fixed');
