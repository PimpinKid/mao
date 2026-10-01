import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's completely overwrite the mobile .container and card CSS to force perfect alignment
new_css = """
            .container { 
                width: 100% !important;
                max-width: 100vw !important;
                padding-left: 15px !important; 
                padding-right: 15px !important; 
                margin: 0 auto !important;
                box-sizing: border-box !important;
            }
            .bottom-grid-top, .bottom-grid-three, .advantages-grid {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            .module-card, .adv-card {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
                margin: 0 !important;
            }
            .activity-table {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
            }
"""

html = html.replace(".container { \n                padding-left: 15px !important; \n                padding-right: 15px !important; \n                max-width: 100vw !important;\n            }", new_css)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Alignment fixed.")
