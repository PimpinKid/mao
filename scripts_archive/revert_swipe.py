import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Pattern to remove the added HORIZONTAL SWIPE GRIDS FOR MOBILE
pattern = r"\s*/\*\s*HORIZONTAL SWIPE GRIDS FOR MOBILE\s*\*/.*?/\*\s*COMPACT BYBIT-STYLE P2P CARDS\s*\*/"
html = re.sub(pattern, "\n            /* COMPACT BYBIT-STYLE P2P CARDS */", html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Swipe removed.")
