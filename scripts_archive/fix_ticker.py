import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Force ticker to never pause
html = html.replace(".ticker-track {", ".ticker-track { pointer-events: none !important; ")

if ".ticker-track:hover" in html:
    html = re.sub(r'\.ticker-track:hover\s*\{[^}]*\}', '', html)

html = html.replace("</style>", """
    .live-ticker { pointer-events: none !important; }
    .ticker-track, .ticker-track:hover, .ticker-track:active, .ticker-track:focus { animation-play-state: running !important; }
</style>
""")

# 2. Ensure ticker is visible on mobile
mobile_css = """
            .live-ticker { display: block !important; visibility: visible !important; position: fixed !important; top: 0 !important; width: 100%; z-index: 9999 !important; }
            .container { padding-top: 45px !important; }
"""

target = "header { position: static !important; }"
if target in html and ".live-ticker { display: block" not in html:
    html = html.replace(target, mobile_css + target)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Ticker fixed.")
