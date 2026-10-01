import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make advantages grid 2x2 on mobile instead of 1fr
html = re.sub(r"\.advantages-grid\s*\{\s*grid-template-columns:\s*1fr;\s*gap:\s*12px;\s*\}", 
              ".advantages-grid { grid-template-columns: 1fr 1fr; gap: 12px; }", html)

# Add CSS for trust-grid
css = """
            /* COMPACT TRUST (ABOUT SERVICE) BLOCK */
            .trust-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-top: 15px;
            }
            .trust-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
                margin-bottom: 0 !important;
            }
            .trust-text p {
                font-size: 11px;
                line-height: 1.3;
            }
"""
if "COMPACT TRUST" not in html:
    html = re.sub(r"\.advantages-grid\s*\{\s*grid-template-columns:\s*1fr 1fr;\s*gap:\s*12px;\s*\}", 
                  ".advantages-grid { grid-template-columns: 1fr 1fr; gap: 12px; }\n" + css, html)

# Also wrap trust items in HTML if not already wrapped
pattern = r'(<div class="trust-item">.*?</div>\s*)(<div class="trust-item">.*?</div>\s*)(<div class="trust-item">.*?</div>\s*)(<div class="trust-item">.*?</div>\s*)'
replacement = r'<div class="trust-grid">\n\1\2\3\4</div>\n'
if "trust-grid" not in html:
    html = re.sub(pattern, replacement, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Trust items wrapped and CSS added.")
