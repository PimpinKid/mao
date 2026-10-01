import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = '<label data-i18n="p2p-ad-limits-range"'

available_block = """            <div class="auth-form-group" style="margin-bottom: 15px;">
                <label style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px; display: block;">Доступный объем (криптовалюта)</label>
                <input type="number" id="ad-available" class="auth-input" placeholder="Например: 1000" style="width: 100%; background: #13151b; border: 1px solid transparent; border-radius: 10px; padding: 15px; color: #fff; font-size: 15px; outline: none;">
            </div>
            """

# Add available_block just before the limits block
idx = html.find(target)
if idx != -1:
    # go back to the start of the <div class="auth-form-group">
    div_start = html.rfind('<div class="auth-form-group"', 0, idx)
    if div_start != -1:
        html = html[:div_start] + available_block + html[div_start:]
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Successfully injected ad-available")
    else:
        print("Could not find div start")
else:
    print("Could not find target")

