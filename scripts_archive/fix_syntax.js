const fs = require('fs');

let js = fs.readFileSync('server.js', 'utf8');

// The broken code block is:
/*
        let calcGet = await calculateExchange(from_currency, to_currency, parseFloat(amount_give));
        if (!calcGet) {
            // Security Fix: Reject order if rate is unknown instead of trusting client amount
        if (!calcGet || isNaN(calcGet) || calcGet <= 0) {
            return res.status(400).json({ error: 'Временная ошибка получения курса обмена. Пожалуйста, попробуйте позже.' });
        }
        
        // Trim precision
        calcGet = calcGet < 1 ? parseFloat(calcGet.toFixed(6)) : parseFloat(calcGet.toFixed(2));

        const depositAddress = generateDepositAddress(from_currency, from_network);
*/

const search = `        let calcGet = await calculateExchange(from_currency, to_currency, parseFloat(amount_give));
        if (!calcGet) {
            // Security Fix: Reject order if rate is unknown instead of trusting client amount
        if (!calcGet || isNaN(calcGet) || calcGet <= 0) {
            return res.status(400).json({ error: 'Временная ошибка получения курса обмена. Пожалуйста, попробуйте позже.' });
        }
        
        // Trim precision
        calcGet = calcGet < 1 ? parseFloat(calcGet.toFixed(6)) : parseFloat(calcGet.toFixed(2));`;

const replace = `        let calcGet = await calculateExchange(from_currency, to_currency, parseFloat(amount_give));
        if (!calcGet || isNaN(calcGet) || calcGet <= 0) {
            return res.status(400).json({ error: 'Временная ошибка получения курса обмена. Пожалуйста, попробуйте позже.' });
        }
        
        // Trim precision
        calcGet = calcGet < 1 ? parseFloat(calcGet.toFixed(6)) : parseFloat(calcGet.toFixed(2));`;

js = js.replace(search, replace);
fs.writeFileSync('server.js', js);
console.log("Fixed!");
