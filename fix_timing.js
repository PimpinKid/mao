const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const regexOld = /setInterval\(\(\) => \{\s*activityCache\.unshift\(generateDummyTrade\(\)\);\s*if \(activityCache\.length > 15\) activityCache\.pop\(\);\s*\}, 15000\); \/\/ New trade every 15 seconds/;

const newLogic = `
    // Fake trade loop with random delay between 15 and 60 minutes
    function scheduleNextTrade() {
        const minMs = 15 * 60 * 1000;
        const maxMs = 60 * 60 * 1000;
        const nextDelay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
        
        setTimeout(() => {
            activityCache.unshift(generateDummyTrade());
            if (activityCache.length > 15) activityCache.pop();
            scheduleNextTrade();
        }, nextDelay);
    }
    
    // Start the loop
    scheduleNextTrade();
`;

// Also fix the pre-fill so it looks like it happened over the last 15 hours, not the last 10 minutes
const regexPrefill = /for\(let i = 0; i < 10; i\+\+\) \{\s*activityCache\.push\(\{ \.\.\.generateDummyTrade\(\), time: Date\.now\(\) - Math\.floor\(Math\.random\(\) \* 600000\) \}\);\s*\}/;

const newPrefill = `
    for(let i = 0; i < 10; i++) {
        // Spread the initial 10 trades over the last 15 hours (54000000 ms)
        activityCache.push({ ...generateDummyTrade(), time: Date.now() - Math.floor(Math.random() * 54000000) });
    }
`;

code = code.replace(regexOld, newLogic);
code = code.replace(regexPrefill, newPrefill);

fs.writeFileSync('server.js', code);
console.log('Timing fixed');
