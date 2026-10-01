const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /<img src="data:image\/svg\+xml;utf8,<svg xmlns='http:\/\/www\.w3\.org\/2000\/svg'[\s\S]*?<\/svg>" class="f-coin usdt">/;
code = code.replace(regex, '<img src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=024" class="f-coin usdt">');

fs.writeFileSync('index.html', code);
console.log('Floating USDT coin restored');
