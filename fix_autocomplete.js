const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regex = /<input type="text" id="user-wallet"/;
const replacement = '<input type="text" id="user-wallet" autocomplete="off" spellcheck="false" data-lpignore="true" data-1p-ignore="true" name="prevent_autofill_wallet"';

content = content.replace(regex, replacement);

fs.writeFileSync('index.html', content);
