import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = ".activity-table { font-size: 11px; }"
new_rules = ".activity-table { font-size: 11px; display: block; overflow-x: auto; }"

if target in html:
    html = html.replace(target, new_rules)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Table overflow fixed.")
else:
    print("Target missing.")
