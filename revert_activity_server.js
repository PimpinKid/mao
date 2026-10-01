const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

// Remove the activity cache and endpoint
const regex = /let activityCache = \[\];[\s\S]*?app\.get\('\/api\/activity', \(req, res\) => \{\s*res\.json\(activityCache\);\s*\}\);/;
code = code.replace(regex, '');

fs.writeFileSync('server.js', code);
console.log('Server activity endpoint removed');
