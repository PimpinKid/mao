import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Change live-ticker mobile css to display: none
html = html.replace(".live-ticker { display: block !important; visibility: visible !important; position: fixed !important; top: 0 !important; width: 100%; z-index: 9999 !important; }", 
                    ".live-ticker { display: none !important; }")

html = html.replace(".live-ticker { \n                left: 0 !important; \n                right: 0 !important;\n                width: 100vw !important;\n                margin: 0 !important;\n            }", "")

# 2. Fix header top position (from 38px to 0)
html = html.replace("top: 38px !important;", "top: 0 !important;")

# 3. Remove .container padding-top: 45px
html = html.replace(".container { padding-top: 45px !important; }", "")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Ticker hidden on mobile, header moved to top 0.")
