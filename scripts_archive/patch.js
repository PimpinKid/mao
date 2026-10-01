const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = "                            if(pm === 'Sberbank') pmClass = 'sber';\n" +
               "                            else if(pm === 'T-Bank') pmClass = 'tbank';\n" +
               "                            else if(pm === 'СБП') pmClass = 'sbp';\n" +
               "                            pmHtml += `<span class=\"bank-pill ${pmClass}\">${pm === 'Sberbank' ? 'Сбербанк' : escapeHtml(pm)}</span> `;";

const repl = "                            if(pm === 'Сбербанк' || pm === 'СБП' || pm === 'Альфа-Банк') pmClass = 'bank-sber';\n" +
             "                            else if(pm === 'Т-Банк' || pm === 'Райффайзенбанк') pmClass = 'bank-tbank';\n" +
             "                            else pmClass = 'bank-cash';\n" +
             "                            pmHtml += `<span class=\"bank-pill ${pmClass}\">${escapeHTML(pm)}</span> `;";

if (html.includes("pm === 'Sberbank'")) {
    html = html.replace(target, repl);
    fs.writeFileSync('index.html', html);
    console.log('Fixed dynamic JS');
} else {
    console.log('Not found');
}
