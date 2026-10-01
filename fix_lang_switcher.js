const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /const idx = parseInt\(timeTd\.getAttribute\('data-timing-idx'\)\) \|\| 0;\s*timeTd\.innerText = lang === 'en' \? \(timingMapEn\[idx\] \|\| '2 min ago'\) : \(timingMapRu\[idx\] \|\| '2 мин назад'\);/;

const replacement = `const custom = timeTd.getAttribute('data-timing-custom');
                if (custom) {
                    if (custom === 'now') {
                        timeTd.innerText = lang === 'en' ? 'just now' : 'только что';
                    } else {
                        timeTd.innerText = lang === 'en' ? custom + ' min ago' : custom + ' мин назад';
                    }
                } else {
                    const idx = parseInt(timeTd.getAttribute('data-timing-idx')) || 0;
                    timeTd.innerText = lang === 'en' ? (timingMapEn[idx] || '2 min ago') : (timingMapRu[idx] || '2 мин назад');
                }`;

code = code.replace(regex, replacement);
fs.writeFileSync('index.html', code);
console.log('Language switcher patched');
