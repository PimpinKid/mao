import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = "selectActiveAsset(type, coin, displayName, coin.networks[index].rateUSD);"
replacement = target + """
                    if (e && e.isTrusted && window.innerWidth <= 768) {
                        if (typeof selectedFrom !== 'undefined' && selectedFrom.coin && typeof selectedTo !== 'undefined' && selectedTo.coin) {
                            setTimeout(() => {
                                const targetCard = document.querySelector('.exchange-grid .exchange-card:nth-child(3)');
                                if (targetCard) targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 150);
                        }
                    }
"""

if target in html and "scrollIntoView" not in html:
    html = html.replace(target, replacement)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Scroll behavior added.")
else:
    print("Already added or target missing.")
