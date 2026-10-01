import re

with open("index.html", "r") as f:
    html = f.read()

# Fix the bug causing custom-select-trigger to disappear
js_bug = """            select.style.display = 'none';

            const trigger = document.createElement('div');
            trigger.className = 'custom-select-trigger';
            // copy classes and styles
            if (select.className) trigger.className += ' ' + select.className;
            if (select.style.cssText) trigger.style.cssText = select.style.cssText;"""

js_fixed = """            const trigger = document.createElement('div');
            trigger.className = 'custom-select-trigger';
            // copy classes and styles
            if (select.className) trigger.className += ' ' + select.className;
            if (select.style.cssText) trigger.style.cssText = select.style.cssText;
            
            select.style.display = 'none';"""

if js_bug in html:
    html = html.replace(js_bug, js_fixed)
    print("Fixed CSS display bug")
else:
    print("Bug pattern not found")

# Remove fiat filter HTML
fiat_filter_pattern = re.compile(r'            <div class="filter-group">\s*<select id="p2p-fiat-filter".*?</select>\s*</div>\n', re.DOTALL)
html = fiat_filter_pattern.sub('', html)

# Remove fiat filter from JS
js_filter_old = """function filterP2POrders() {
    const paymentFilter = document.getElementById('p2p-payment-filter').value.toLowerCase();
    const amountFilterStr = document.getElementById('p2p-amount-filter').value;
    const amountFilter = parseFloat(amountFilterStr);
    const coinFilter = document.getElementById('p2p-coin-filter').value;
    const fiatFilter = document.getElementById('p2p-fiat-filter').value;"""

js_filter_new = """function filterP2POrders() {
    const paymentFilter = document.getElementById('p2p-payment-filter').value.toLowerCase();
    const amountFilterStr = document.getElementById('p2p-amount-filter').value;
    const amountFilter = parseFloat(amountFilterStr);
    const coinFilter = document.getElementById('p2p-coin-filter').value;"""

html = html.replace(js_filter_old, js_filter_new)

# Remove fiat check from loop
fiat_check_pattern = re.compile(r'        const cardFiat = card\.querySelector\(\'\.bento-price-value span\'\)\.innerText\.trim\(\);\s*if \(fiatFilter && cardFiat !== fiatFilter\) \{\s*match = false;\s*\}')
html = fiat_check_pattern.sub('', html)

with open("index.html", "w") as f:
    f.write(html)
print("Removed fiat filter")
