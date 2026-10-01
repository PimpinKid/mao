import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's extract all media queries
matches = re.findall(r'@media\s*\([^\{]+\)\s*\{[^}]+\}', html, flags=re.DOTALL)
for m in matches:
    print(m[:200] + "...")
