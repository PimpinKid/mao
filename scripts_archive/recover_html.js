const fs = require('fs');
const readline = require('readline');

async function run() {
    const fileStream = fs.createReadStream('/Users/a./.gemini/antigravity/brain/23d96b5f-980e-4d4d-b1b6-952bf857b29d/.system_generated/logs/transcript_full.jsonl');
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    const linesMap = {};

    for await (const line of rl) {
        if (!line.includes('"name":"default_api:view_file"')) {
            // We want the output of the tool, not the call.
            // Wait, the output is in the next step or same step? 
            // In the transcript, tool responses have "type":"TOOL_RESPONSE" or are embedded in PLANNER_RESPONSE?
            // Actually, let's just use a regex on the raw line.
        }
        
        // Simple extraction: look for patterns like \n1234: <content>
        // Since transcript_full is JSON, \n is \\n.
        // Let's parse JSON
        try {
            const obj = JSON.parse(line);
            if (obj.content) {
                // If it's a tool response containing file lines
                if (obj.content.includes('File Path: `file:///Users/a./Desktop/back%20end%20work/index.html`') || obj.content.includes('index.html')) {
                    const lines = obj.content.split('\n');
                    for (const l of lines) {
                        const match = l.match(/^(\d+):\s(.*)/);
                        if (match) {
                            const lineNum = parseInt(match[1], 10);
                            const content = match[2];
                            // keep the most recent version of the line
                            linesMap[lineNum] = content;
                        }
                    }
                }
            }
            if (obj.tool_responses) {
                for (const tr of obj.tool_responses) {
                    if (tr.output && tr.output.includes('index.html')) {
                        const lines = tr.output.split('\n');
                        for (const l of lines) {
                            const match = l.match(/^(\d+):\s(.*)/);
                            if (match) {
                                const lineNum = parseInt(match[1], 10);
                                const content = match[2];
                                linesMap[lineNum] = content;
                            }
                        }
                    }
                }
            }
        } catch (e) {}
    }

    const maxLine = Math.max(...Object.keys(linesMap).map(Number));
    console.log(`Recovered up to line ${maxLine}. Total unique lines recovered: ${Object.keys(linesMap).length}`);
    
    let recoveredText = '';
    for (let i = 1; i <= maxLine; i++) {
        if (linesMap[i] !== undefined) {
            recoveredText += linesMap[i] + '\n';
        } else {
            recoveredText += `<!-- MISSING LINE ${i} -->\n`;
        }
    }
    
    fs.writeFileSync('recovered_index.html', recoveredText);
}
run();
