const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const marker = "function generateDepositAddress";
const startIdx = code.indexOf(marker);

const fn = `
async function sendVerificationEmail(toEmail, code, subject = 'Код подтверждения — MAO Exchange') {
    console.log('\\n--------------------------------------------------');
    console.log('\uD83D\uDCE7 [EMAIL СИМУЛЯТОР] Письмо на ' + toEmail);
    console.log('Тема: ' + subject);
    console.log('Код: ' + code);
    console.log('--------------------------------------------------\\n');
    return { success: true, simulated: true };
}
`;

if (startIdx !== -1) {
    code = code.substring(0, startIdx) + fn + code.substring(startIdx);
    fs.writeFileSync('server.js', code);
    console.log("Added sendVerificationEmail back!");
}
