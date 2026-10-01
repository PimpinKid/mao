import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

bad = """            <div class="auth-form-group" style="margin-bottom: 15px;">
                <label data-i18n="p2p-ad-asset-fiat" style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px; display: block;">Актив и Фиат</label>
                <div style="display:flex; gap:10px;">
                    <select id="ad-crypto" class="auth-input" style="width: 50%; background: #13151b; border: 1px solid transparent; border-radius: 10px; padding: 15px; color: #fff; font-size: 15px; outline: none;"><option value="USDT">USDT</option><option value="BTC">BTC</option></select>
                    <select id="ad-fiat" class="auth-input" style="width: 50%; background: #13151b; border: 1px solid transparent; border-radius: 10px; padding: 15px; color: #fff; font-size: 15px; outline: none;"><option value="RUB">RUB</option><option value="USD">USD</option></select>
                </div>
            </div>"""

good = """            <div class="auth-form-group" style="margin-bottom: 15px;">
                <label data-i18n="p2p-ad-asset" style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px; display: block;">Актив</label>
                <div style="display:flex; gap:10px;">
                    <select id="ad-crypto" class="auth-input" style="width: 100%; background: #13151b; border: 1px solid transparent; border-radius: 10px; padding: 15px; color: #fff; font-size: 15px; outline: none;"><option value="USDT">USDT</option><option value="BTC">BTC</option></select>
                    <input type="hidden" id="ad-fiat" value="RUB">
                </div>
            </div>"""

if bad in html:
    html = html.replace(bad, good)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Replaced fiat successfully.")
else:
    print("Pattern not found. Checking if it's already replaced...")
    if good in html:
        print("Already replaced.")
    else:
        print("Could not find exact block to replace.")

