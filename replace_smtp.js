const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const startIdx = code.indexOf('async function sendVerificationEmail');
const endMarker = 'console.error(`❌ Ошибка отправки письма на';
let endIdx = code.indexOf(endMarker, startIdx);
endIdx = code.indexOf('}', endIdx) + 1; // get the closing brace of the catch block
endIdx = code.indexOf('}', endIdx) + 1; // get the closing brace of the function

if (startIdx !== -1 && endIdx !== 0) {
    const replacement = `async function sendVerificationEmail(toEmail, code, subject = 'Код подтверждения — MAO Exchange') {
    console.log('\\n--------------------------------------------------');
    console.log('\uD83D\uDCE7 [EMAIL СИМУЛЯТОР] Письмо на ' + toEmail);
    console.log('Тема: ' + subject);
    console.log('Код: ' + code);
    console.log('--------------------------------------------------\\n');
    return { success: true, simulated: true };
}`;
    code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
    fs.writeFileSync('server.js', code);
    console.log('Replaced successfully');
} else {
    console.log('Could not find boundaries');
}
