import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's see how trust-item is structured in HTML
pattern = r'(<div class="trust-item">.*?</div>\s*)(<div class="trust-item">.*?</div>\s*)(<div class="trust-item">.*?</div>\s*)(<div class="trust-item">.*?</div>\s*)'
replacement = r'<div class="trust-grid">\1\2\3\4</div>'

if "trust-grid" not in html:
    html = re.sub(pattern, replacement, html, flags=re.DOTALL)

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
                gap: 5px;
                margin-bottom: 0 !important;
            }
            .trust-text p {
                font-size: 11px;
                line-height: 1.3;
            }
"""
if "COMPACT TRUST (ABOUT SERVICE) BLOCK" not in html:
    html = html.replace(".advantages-grid { grid-template-columns: 1fr 1fr; gap: 12px; }", 
                        ".advantages-grid { grid-template-columns: 1fr 1fr; gap: 12px; }\n" + css)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Trust items wrapped and CSS added.")
