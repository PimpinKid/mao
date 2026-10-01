const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = `            if (!container) return;
            container.innerHTML = '';
            data.forEach(msg => {
                
            if(typeof playBeep !== 'undefined') {
                if(msg.message.includes('Оплата подтверждена') || msg.message.includes('диспут') || msg.message.includes('ВНИМАНИЕ')) {
                    playBeep('alert');
                } else {
                    playBeep('chat');
                }
            }
            const isMine = (msg.sender_type === 'taker' && !window.currentDealIsMaker) || (msg.sender_type === 'maker' && window.currentDealIsMaker);`;

const repl = `            if (!container) return;
            
            // Play sound only if new messages arrive after initial load
            if (container.children.length > 0 && data.length > container.children.length) {
                const lastMsg = data[data.length - 1];
                if(typeof playBeep !== 'undefined') {
                    if(lastMsg.message.includes('Оплата подтверждена') || lastMsg.message.includes('диспут') || lastMsg.message.includes('ВНИМАНИЕ')) {
                        playBeep('alert');
                    } else {
                        playBeep('chat');
                    }
                }
            }

            container.innerHTML = '';
            data.forEach(msg => {
            const isMine = (msg.sender_type === 'taker' && !window.currentDealIsMaker) || (msg.sender_type === 'maker' && window.currentDealIsMaker);`;

if (html.includes("if(typeof playBeep !== 'undefined') {")) {
    html = html.replace(target, repl);
    fs.writeFileSync('index.html', html);
    console.log('Audio looping fixed.');
} else {
    console.log('Audio loop target not found.');
}
