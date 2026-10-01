import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace("max-width: 100vw !important;\n                overflow-x: hidden !important;", "max-width: 100vw !important;")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Removed overflow-x hidden from container.")
