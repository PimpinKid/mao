import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_media = r'@media \(max-width: 768px\) \{\s*\.p2p-bento-grid \{ grid-template-columns: 1fr; \}\s*\}'
new_media = """@media (max-width: 768px) {
            .p2p-bento-grid { grid-template-columns: 1fr; gap: 15px; }
            .p2p-bento-card { padding: 16px; gap: 12px; }
            .bento-price-value { font-size: 22px; }
            .limit-text { flex-direction: column; align-items: flex-start; gap: 5px; }
            .bento-card-bottom { flex-direction: column; align-items: stretch; gap: 12px; }
            .bento-banks { max-width: 100%; }
            .bento-buy-btn, .bento-sell-btn {
                position: relative;
                bottom: auto; right: auto;
                width: 100%;
                margin-top: 5px;
                text-align: center;
            }
            /* Add some fixes for the crypto cards if any text overlaps */
            .p2p-bento-card .bento-merchant .bento-stats { white-space: normal; line-height: 1.3; }
        }"""

if re.search(old_media, html):
    html = re.sub(old_media, new_media, html)
    print("Patched mobile CSS successfully.")
else:
    print("Could not find the target media query.")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

