const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const anchor = "// -----------------------------------";
const sortLogic = `
                // Sort data so Top 3 are always rendered first
                data.sort((a, b) => {
                    const rankA = a.topRank || 999;
                    const rankB = b.topRank || 999;
                    return rankA - rankB;
                });
                // -----------------------------------`;

code = code.replace(anchor, sortLogic);

fs.writeFileSync('index.html', code);
console.log('Sorting logic added');
