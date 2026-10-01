const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /<div>VOL \(24H\): <span style="color: #fff;">45,231,509 RUB<\/span><\/div>[\s\S]*?<div>ESCROW LOCKED: <span style="color: var\(--green\);">38<\/span><\/div>/;

const replacement = `<div>VOL (24H): <span id="live-vol" style="color: #fff;">45,231,509</span> RUB</div>
                    <div>MAKERS: <span id="live-makers" style="color: #fff;">142</span></div>
                    <div>ESCROW LOCKED: <span id="live-locked" style="color: var(--green);">38</span></div>`;

code = code.replace(regex, replacement);

const scriptInjection = `
    // Animate Live Stats
    let currentVol = 45231509;
    let currentMakers = 142;
    let currentLocked = 38;
    
    setInterval(() => {
        currentVol += Math.floor(Math.random() * 50000);
        document.getElementById('live-vol').innerText = currentVol.toLocaleString('en-US');
        
        if (Math.random() > 0.8) {
            currentMakers += Math.floor(Math.random() * 3) - 1; 
            document.getElementById('live-makers').innerText = currentMakers;
        }
        
        if (Math.random() > 0.5) {
            currentLocked += Math.floor(Math.random() * 5) - 2; 
            if (currentLocked < 10) currentLocked = 10;
            document.getElementById('live-locked').innerText = currentLocked;
        }
    }, 8000);
`;

code = code.replace('// Initialize UI', scriptInjection + '\n    // Initialize UI');

fs.writeFileSync('index.html', code);
console.log('Live stats patched');
