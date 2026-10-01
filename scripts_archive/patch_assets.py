import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = "{ code: 'LINK', name: 'Chainlink', category: 'crypto', icon: 'https://cryptologos.cc/logos/chainlink-link-logo.svg?v=032', networks: [{ net: 'ERC-20', rateUSD: 18 }] }"

new_assets = target + """,
        { code: 'XMR', name: 'Monero', category: 'crypto', icon: 'https://cryptologos.cc/logos/monero-xmr-logo.svg?v=032', networks: [{ net: 'Monero', rateUSD: 160 }] },
        { code: 'BCH', name: 'Bitcoin Cash', category: 'crypto', icon: 'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.svg?v=032', networks: [{ net: 'Bitcoin Cash', rateUSD: 300 }] },
        { code: 'ETC', name: 'Ethereum Classic', category: 'crypto', icon: 'https://cryptologos.cc/logos/ethereum-classic-etc-logo.svg?v=032', networks: [{ net: 'Ethereum Classic', rateUSD: 25 }] },
        { code: 'LTC', name: 'Litecoin', category: 'crypto', icon: 'https://cryptologos.cc/logos/litecoin-ltc-logo.svg?v=032', networks: [{ net: 'Litecoin', rateUSD: 85 }] },
        { code: 'ZEC', name: 'Zcash', category: 'crypto', icon: 'https://cryptologos.cc/logos/zcash-zec-logo.svg?v=032', networks: [{ net: 'Zcash', rateUSD: 30 }] }"""

html = html.replace(target, new_assets)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("index.html patched with new assets")
