import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Restore margin-bottom for containers
html = html.replace(".bottom-grid-top, .bottom-grid-three, .advantages-grid {\n                width: 100% !important;\n                max-width: 100% !important;\n                min-width: 0 !important;\n                box-sizing: border-box !important;\n                margin: 0 !important;\n                padding: 0 !important;\n            }",
                    ".bottom-grid-top, .bottom-grid-three, .advantages-grid {\n                width: 100% !important;\n                max-width: 100% !important;\n                min-width: 0 !important;\n                box-sizing: border-box !important;\n                margin-bottom: 20px !important;\n                padding: 0 !important;\n            }")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Margins restored.")
