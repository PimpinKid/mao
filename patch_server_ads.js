const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

// The original line: const ads = await dbAll(`SELECT * FROM p2p_ads WHERE status = 'active'`);
// We will replace it with a JOIN
const newQuery = `const ads = await dbAll("SELECT p2p_ads.*, users.display_name as display_name, users.is_verified_trader as is_verified_trader FROM p2p_ads JOIN users ON p2p_ads.maker_id = users.id WHERE p2p_ads.status = 'active'");`;

code = code.replace(/const ads = await dbAll\(\`SELECT \* FROM p2p_ads WHERE status = 'active'\`\);/g, newQuery);

fs.writeFileSync('server.js', code);
console.log('API Patched');
