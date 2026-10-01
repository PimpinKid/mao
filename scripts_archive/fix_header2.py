import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = ".header-right { display: contents; }"
new_header = ".header-right { display: contents !important; }"

if target in html:
    html = html.replace(target, new_header)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Header CSS !important updated.")
else:
    print("Target not found.")

