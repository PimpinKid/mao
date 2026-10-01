import re

with open("index.html", "r") as f:
    html = f.read()

fiat_filter_html = """            <div class="filter-group">
                <select id="p2p-fiat-filter" class="p2p-select" onchange="filterP2POrders()">
                    <option value="RUB">RUB</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="KZT">KZT</option>
                </select>
            </div>
            <div class="filter-group">
                <input type="number" id="p2p-amount-filter\""""

html = html.replace('            <div class="filter-group">\n                <input type="number" id="p2p-amount-filter"', fiat_filter_html)

# Update the JS function filterP2POrders
js_old = """function filterP2POrders() {
    const paymentFilter = document.getElementById('p2p-payment-filter').value.toLowerCase();
    const amountFilterStr = document.getElementById('p2p-amount-filter').value;
    const amountFilter = parseFloat(amountFilterStr);
    const coinFilter = document.getElementById('p2p-coin-filter').value;"""

js_new = """function filterP2POrders() {
    const paymentFilter = document.getElementById('p2p-payment-filter').value.toLowerCase();
    const amountFilterStr = document.getElementById('p2p-amount-filter').value;
    const amountFilter = parseFloat(amountFilterStr);
    const coinFilter = document.getElementById('p2p-coin-filter').value;
    const fiatFilter = document.getElementById('p2p-fiat-filter').value;"""

html = html.replace(js_old, js_new)

# In filterP2POrders, it iterates cards:
#   const cardCoin = card.getAttribute('data-coin');
#   const cardFiat = card.querySelector('.bento-price-value span').innerText.trim();
# We need to make sure the filtering logic also checks fiatFilter
js_filter_old = """        if (coinFilter && cardCoin !== coinFilter) {
            match = false;
        }"""
        
js_filter_new = """        if (coinFilter && cardCoin !== coinFilter) {
            match = false;
        }
        
        const cardFiat = card.querySelector('.bento-price-value span').innerText.trim();
        if (fiatFilter && cardFiat !== fiatFilter) {
            match = false;
        }"""

html = html.replace(js_filter_old, js_filter_new)

with open("index.html", "w") as f:
    f.write(html)
print("Updated fiat filter in index.html")
