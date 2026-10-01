const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Add inline onclick to the button to debug if event listener was the issue
content = content.replace(
    'id="btn-connect-web3" class="btn-outline"',
    'id="btn-connect-web3" onclick="if(window.web3Modal) { window.web3Modal.open(); } else { alert(\'Web3 модуль еще загружается или заблокирован браузером (AdBlock). Пожалуйста, подождите...\'); }" class="btn-outline"'
);

// Remove the DOMContentLoaded wrapper for the module just in case it fired too early
content = content.replace(
    /document\.addEventListener\('DOMContentLoaded', \(\) => \{\s*const btnWeb3 = document\.getElementById\('btn-connect-web3'\);\s*if \(btnWeb3\) \{\s*btnWeb3\.addEventListener\('click', async \(e\) => \{\s*e\.preventDefault\(\);\s*await modal\.open\(\);\s*\}\);\s*\}\s*\}\);/g,
    `const btnWeb3 = document.getElementById('btn-connect-web3');
    if (btnWeb3) {
        btnWeb3.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await modal.open();
            } catch(err) {
                alert('Ошибка Web3: ' + err.message);
            }
        });
    }`
);

fs.writeFileSync('index.html', content);
