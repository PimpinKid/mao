const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script.*?>([\s\S]*?)<\/script>/g)];
scripts.forEach((match, index) => {
    try {
        new vm.Script(match[1]);
        console.log(`Script ${index} is OK`);
    } catch (e) {
        console.error(`Script ${index} Syntax Error:`, e.message);
    }
});
