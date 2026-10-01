import re

with open('server.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace the insecure fallback
insecure_pattern = r"// Fallback if Binance API failed.*?calcGet = calcGet < 1 \? parseFloat\(calcGet\.toFixed\(6\)\) : parseFloat\(calcGet\.toFixed\(2\)\);\n\s*\}"
secure_replacement = """// Security Fix: Reject order if rate is unknown instead of trusting client amount
        if (!calcGet || isNaN(calcGet) || calcGet <= 0) {
            return res.status(400).json({ error: 'Временная ошибка получения курса обмена. Пожалуйста, попробуйте позже.' });
        }
        
        // Trim precision
        calcGet = calcGet < 1 ? parseFloat(calcGet.toFixed(6)) : parseFloat(calcGet.toFixed(2));"""
js = re.sub(insecure_pattern, secure_replacement, js, flags=re.DOTALL)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Security patched.")
