import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add input field
bad_html = """            <div class="auth-form-group" style="margin-bottom: 15px;">
                <label data-i18n="p2p-ad-limits-range" style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px; display: block;">Лимиты (от - до)</label>
                <div style="display:flex; gap:10px;">
                    <input type="number" id="ad-min" class="auth-input" placeholder="Мин" style="width: 50%; background: #13151b; border: 1px solid transparent; border-radius: 10px; padding: 15px; color: #fff; font-size: 15px; outline: none;">
                    <input type="number" id="ad-max" class="auth-input" placeholder="Макс" style="width: 50%; background: #13151b; border: 1px solid transparent; border-radius: 10px; padding: 15px; color: #fff; font-size: 15px; outline: none;">
                </div>
            </div>"""

good_html = """            <div class="auth-form-group" style="margin-bottom: 15px;">
                <label style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px; display: block;">Доступный объем (криптовалюта)</label>
                <input type="number" id="ad-available" class="auth-input" placeholder="Например: 1000" style="width: 100%; background: #13151b; border: 1px solid transparent; border-radius: 10px; padding: 15px; color: #fff; font-size: 15px; outline: none;">
            </div>
""" + bad_html

html = html.replace(bad_html, good_html)

# Patch submitP2PAd
bad_js = """    const min_limit = parseFloat(document.getElementById('ad-min').value);
    const max_limit = parseFloat(document.getElementById('ad-max').value);
    const pmCheckboxes = document.querySelectorAll('input[name="ad-pm"]:checked');
    const payment_methods = Array.from(pmCheckboxes).map(cb => cb.value);
    const errBox = document.getElementById('createAdError');
    
    if(!price || !min_limit || !max_limit || payment_methods.length === 0) {"""

good_js = """    const min_limit = parseFloat(document.getElementById('ad-min').value);
    const max_limit = parseFloat(document.getElementById('ad-max').value);
    const available_amount = parseFloat(document.getElementById('ad-available').value);
    const pmCheckboxes = document.querySelectorAll('input[name="ad-pm"]:checked');
    const payment_methods = Array.from(pmCheckboxes).map(cb => cb.value);
    const errBox = document.getElementById('createAdError');
    
    if(!price || !min_limit || !max_limit || !available_amount || payment_methods.length === 0) {"""

html = html.replace(bad_js, good_js)

# Patch fetch payload
bad_payload = """        body: JSON.stringify({ type, crypto, fiat, price, min_limit, max_limit, payment_methods })"""
good_payload = """        body: JSON.stringify({ type, crypto, fiat, price, min_limit, max_limit, available_amount, payment_methods })"""
html = html.replace(bad_payload, good_payload)


with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("index.html patched with available amount input")
