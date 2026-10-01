const fs = require('fs');
for (const file of ['index.html', 'admin.html']) {
    const html = fs.readFileSync(file, 'utf8');
    const regex = /<script>([\s\S]*?)<\/script>/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
        try { new Function(match[1]); } 
        catch (e) { console.error("Syntax Error in", file, e.message); process.exit(1); }
    }
}
console.log("All scripts OK");
