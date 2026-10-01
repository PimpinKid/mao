with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace all occurrences back to the original
import re
html = re.sub(r'headers: getAuthHeaders\(\),\s*// headers: \{', 'headers: {', html)

# Then selectively fix the one in submitP2PAd
good_str = """    fetch('/api/p2p/ads', {
        method: 'POST',
        headers: Object.assign({'Content-Type': 'application/json'}, getAuthHeaders()),
        body: JSON.stringify({ type, crypto, fiat, price, min_limit, max_limit, payment_methods })
    })"""

bad_str = """    fetch('/api/p2p/ads', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, crypto, fiat, price, min_limit, max_limit, payment_methods })
    })"""

if bad_str in html:
    html = html.replace(bad_str, good_str)
else:
    print("bad_str not found in index.html for submitP2PAd!")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
