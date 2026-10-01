const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(/ad\.successRate = ad\.success_rate \|\| \(strToHash\(ad\.safeName\) \% 5 \+ 95\);/, `ad.successRate = ad.success_rate || ((strToHash(ad.safeName) % 50) / 10 + 95).toFixed(1);`);

fs.writeFileSync('index.html', code);
console.log('Success Rate patched');
