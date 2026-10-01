const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// 1. Remove the old inline script
const oldScriptRegex = /\/\/ Simple rate timer countdown visual \[\s\S\]*?let timeLeft = 900;[\s\S]*?setInterval\(\(\) => \{[\s\S]*?if\(timeLeft > 0\) timeLeft--;[\s\S]*?const m = Math\.floor\(timeLeft \/ 60\);[\s\S]*?const s = timeLeft % 60;[\s\S]*?const el = document\.getElementById\('rate-timer-display'\);[\s\S]*?if\(el\) el\.textContent = \`\$\{m\}:\$\{s\.toString\(\)\.padStart\(2, '0'\)\}\`;[\s\S]*?\}, 1000\);/g;
content = content.replace(oldScriptRegex, '');

// Actually, I can just replace the whole `<script>` inside that `exchange-card` block since it contains `handleCryptoWalletDetect` and the timer.
