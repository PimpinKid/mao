const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /<div class="partners-bar" style="margin-top: 0; justify-content: center; width: 100%;">[\s\S]*?<\/div>/;

const replacement = `<div class="partners-bar" style="margin-top: 0; justify-content: center; width: 100%; display: flex; gap: 30px; opacity: 0.5; filter: grayscale(100%);">
                <!-- BestChange dummy SVG -->
                <svg width="100" height="24" viewBox="0 0 100 24" fill="currentColor"><text x="0" y="18" font-size="18" font-weight="900" font-family="Arial">BestChange</text></svg>
                <!-- RBC dummy SVG -->
                <svg width="60" height="24" viewBox="0 0 60 24" fill="currentColor"><rect width="20" height="20" fill="currentColor"/><text x="25" y="18" font-size="18" font-weight="900" font-family="Arial">РБК</text></svg>
                <!-- ExchangeSumo dummy SVG -->
                <svg width="120" height="24" viewBox="0 0 120 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="currentColor"/><text x="28" y="18" font-size="16" font-weight="bold" font-family="Arial">ExchangeSumo</text></svg>
                <!-- Bits.media dummy SVG -->
                <svg width="90" height="24" viewBox="0 0 90 24" fill="currentColor"><text x="0" y="18" font-size="16" font-weight="bold" font-family="Arial">Bits.media</text></svg>
            </div>`;

code = code.replace(regex, replacement);
fs.writeFileSync('index.html', code);
console.log('Logos patched');
