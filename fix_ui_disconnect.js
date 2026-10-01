const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const oldBtnHtml = `<button id="btn-connect-web3" onclick="connectWeb3Wallet()" class="btn-outline" style="background: var(--accent-orange); border-color: var(--accent-orange); color: #14100d; font-weight: 900; text-transform: uppercase; font-family: monospace; font-size: 14px; padding: 14px; box-shadow: 4px 4px 0px #b56c25; border-radius: 0; cursor: pointer; transition: 0.1s;" onmousedown="this.style.transform='translate(2px, 2px)'; this.style.boxShadow='2px 2px 0px #b56c25';" onmouseup="this.style.transform='none'; this.style.boxShadow='4px 4px 0px #b56c25';">
                    ПОДКЛЮЧИТЬ WEB3 КОШЕЛЕК
                </button>`;

const newBtnHtml = `<div style="display: flex; gap: 10px; width: 100%;">
                    <button id="btn-connect-web3" onclick="connectWeb3Wallet()" class="btn-outline" style="flex: 1; background: var(--accent-orange); border-color: var(--accent-orange); color: #14100d; font-weight: 900; text-transform: uppercase; font-family: monospace; font-size: 14px; padding: 14px; box-shadow: 4px 4px 0px #b56c25; border-radius: 0; cursor: pointer; transition: 0.1s;" onmousedown="this.style.transform='translate(2px, 2px)'; this.style.boxShadow='2px 2px 0px #b56c25';" onmouseup="this.style.transform='none'; this.style.boxShadow='4px 4px 0px #b56c25';">
                        ПОДКЛЮЧИТЬ WEB3 КОШЕЛЕК
                    </button>
                    <button id="btn-disconnect-web3" onclick="disconnectWeb3Wallet()" class="btn-outline" style="display: none; background: transparent; border: 1px solid #ff4444; color: #ff4444; padding: 14px 20px; font-family: monospace; font-weight: bold; border-radius: 0; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#ff4444'; this.style.color='#14100d';" onmouseout="this.style.background='transparent'; this.style.color='#ff4444';">
                        ✕ ОТВЯЗАТЬ
                    </button>
                </div>`;

content = content.replace(oldBtnHtml, newBtnHtml);

fs.writeFileSync('index.html', content);
