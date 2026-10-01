const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const sbpBeautifulSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 40'><defs><linearGradient id='gradL' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='%233b82f6'/><stop offset='100%' stop-color='%238b5cf6'/></linearGradient><linearGradient id='gradT' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='%23facc15'/><stop offset='100%' stop-color='%23ef4444'/></linearGradient><linearGradient id='gradB' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='%234ade80'/><stop offset='100%' stop-color='%23059669'/></linearGradient></defs><path d='M4 11 V 29 L 18 20 Z' fill='url(%23gradL)'/><path d='M32 1 V 19 L 18 10 Z' fill='url(%23gradT)'/><path d='M32 21 V 39 L 18 30 Z' fill='url(%23gradB)'/></svg>";

code = code.replace(/https:\/\/cryptologos\.cc\/logos\/tether-usdt-logo\.svg\?v=032/g, sbpBeautifulSvg);
code = code.replace(/https:\/\/cryptologos\.cc\/logos\/tether-usdt-logo\.svg\?v=024/g, sbpBeautifulSvg);

fs.writeFileSync('index.html', code);
console.log('USDT Logo replaced with beautiful SBP SVG');
