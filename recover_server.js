const fs = require('fs');
const cp = require('child_process');

let maxLen = 0;
let bestContent = null;

const logs = cp.execSync('find /Users/a./.gemini/antigravity/brain/ -name "transcript_full.jsonl"').toString().trim().split('\n');
for (const log of logs) {
    if (!log) continue;
    const lines = fs.readFileSync(log, 'utf8').split('\n');
    for (const line of lines) {
        if (!line) continue;
        try {
            const obj = JSON.parse(line);
            
            // Check tool_responses for view_file outputs
            if (obj.tool_responses) {
                for (const resp of obj.tool_responses) {
                    if (resp.output && resp.output.includes("app.post('/api/p2p/ads'")) {
                        if (resp.output.length > maxLen) {
                            maxLen = resp.output.length;
                            bestContent = resp.output;
                        }
                    }
                }
            }
        } catch(e) {}
    }
}

if (bestContent) {
    fs.writeFileSync('server_recovered.js', bestContent);
    console.log("Found file of length", maxLen);
} else {
    console.log("Not found in any view_file output.");
}
