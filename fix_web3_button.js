const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const oldButtonRegex = /<button id="btn-connect-web3"[^>]*>([\s\S]*?)<\/button>/i;

const newButton = `<button id="btn-connect-web3" onclick="connectWeb3Wallet()" class="btn-outline" style="background: var(--accent-orange); border-color: var(--accent-orange); color: #14100d; font-weight: 900; text-transform: uppercase; font-family: monospace; font-size: 14px; padding: 14px; box-shadow: 4px 4px 0px #b56c25; border-radius: 0; cursor: pointer; transition: 0.1s;" onmousedown="this.style.transform='translate(2px, 2px)'; this.style.boxShadow='2px 2px 0px #b56c25';" onmouseup="this.style.transform='none'; this.style.boxShadow='4px 4px 0px #b56c25';">
                    ПОДКЛЮЧИТЬ WEB3 КОШЕЛЕК
                </button>`;

content = content.replace(oldButtonRegex, newButton);

fs.writeFileSync('index.html', content);
