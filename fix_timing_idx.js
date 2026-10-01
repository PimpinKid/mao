const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /const timingText = currentLang === 'en' \? \(prepend \? 'just now' : Math\.floor\(Math\.random\(\)\*59\+1\) \+ ' min ago'\) : \(prepend \? 'только что' : Math\.floor\(Math\.random\(\)\*59\+1\) \+ ' мин назад'\);[\s\S]*?'<td style="color: var\(--text-muted\);">'/;

const replacement = `const timingIdx = prepend ? 0 : Math.floor(Math.random() * 11) + 1;
        const timingMapEng = ['just now', 'few secs ago', '15 secs ago', '30 secs ago', '1 min ago', '2 min ago', '3 min ago', '5 min ago', '8 min ago', '10 min ago', '12 min ago', '15 min ago'];
        const timingMapRus = ['только что', 'пару секунд назад', '15 секунд назад', '30 секунд назад', '1 мин назад', '2 мин назад', '3 мин назад', '5 мин назад', '8 мин назад', '10 мин назад', '12 мин назад', '15 мин назад'];
        const timingText = currentLang === 'en' ? timingMapEng[timingIdx] : timingMapRus[timingIdx];

        const tr = document.createElement('tr');
        if (prepend) {
            tr.style.animation = "flashGreen 1s ease-out";
        }
        
        tr.innerHTML = 
            '<td><b>' + direction + '</b></td>' +
            '<td>' + amount + ' ' + (isBuy ? fiat : coin) + '</td>' +
            '<td><span class="status-badge completed" data-stat-class="completed">' + statTitle + '</span></td>' +
            '<td data-timing-idx="' + timingIdx + '" style="color: var(--text-muted);">'`;

code = code.replace(regex, replacement);

fs.writeFileSync('index.html', code);
console.log('Timing Idx patched');
