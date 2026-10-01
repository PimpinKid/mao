import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Fix mobile CSS
target_css = ".header-center-nav { width: 100%; justify-content: center; gap: 15px; padding: 10px; overflow-x: auto; }"
new_css = ".header-center-nav { position: relative !important; transform: none !important; left: auto !important; width: 100%; justify-content: center; gap: 15px; padding: 10px; overflow-x: auto; }\n            .logo { justify-content: center; width: 100%; }"
if target_css in html:
    html = html.replace(target_css, new_css)
else:
    print("CSS target not found.")

# 2. Remove amount filter HTML
# The whitespace might not match exactly, so I'll use regex.
html = re.sub(r'<div class="filter-group">\s*<input type="number" id="p2p-amount-filter" class="p2p-amount-input" placeholder="Введите сумму\.\.\." oninput="filterP2POrders\(\)">\s*</div>', '', html)

# 3. Remove JS variable assignment
html = re.sub(r'const amountFilterStr = document\.getElementById\(\'p2p-amount-filter\'\)\.value;\s*const amountFilter = parseFloat\(amountFilterStr\);', '', html)

# 4. Remove Filter by Amount Limits block
amount_block_pattern = r'// Filter by Amount Limits.*?show = false;\s*}\s*}\s*}\s*}'
html = re.sub(amount_block_pattern, '', html, flags=re.DOTALL)

# 5. Remove placeholder translation
html = re.sub(r'// Update P2P Amount input placeholder\s*const p2pAmountInput = document\.getElementById\(\'p2p-amount-filter\'\);\s*if \(p2pAmountInput\) p2pAmountInput\.placeholder = lang === \'en\' \? \'Enter amount\.\.\.\' : \'Введите сумму\.\.\.\';', '', html)


with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Amount filter removed and header fixed.")
