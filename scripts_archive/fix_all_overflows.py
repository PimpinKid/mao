import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

css_fixes = """
            /* ABSOLUTE MOBILE FIXES */
            .container {
                width: 100% !important;
                max-width: 100vw !important;
                padding-left: 15px !important;
                padding-right: 15px !important;
                margin: 0 auto !important;
                box-sizing: border-box !important;
                overflow-x: hidden !important;
            }
            .bottom-grid-top, .bottom-grid-three, .advantages-grid {
                width: 100% !important;
                max-width: 100% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            .module-card, .adv-card {
                width: 100% !important;
                max-width: 100% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
                margin: 0 !important;
                overflow: hidden !important;
            }
            .activity-table {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                overflow-x: auto !important;
                -webkit-overflow-scrolling: touch !important;
                box-sizing: border-box !important;
            }
"""

# Replace the previous alignment block
pattern = r"\.module-card, \.adv-card\s*\{.*?\}"
html = re.sub(pattern, "", html, flags=re.DOTALL)
pattern2 = r"\.bottom-grid-top, \.bottom-grid-three, \.advantages-grid\s*\{.*?\}"
html = re.sub(pattern2, "", html, flags=re.DOTALL)
pattern3 = r"\.container\s*\{\s*width: 100%.*?\}"
html = re.sub(pattern3, "", html, flags=re.DOTALL)
pattern4 = r"\.activity-table\s*\{.*?\}"
html = re.sub(pattern4, "", html, flags=re.DOTALL)

# Insert it inside @media (max-width: 768px) block at the end
# We'll just add it right before the closing bracket of the media query
# Wait, index.html has multiple @media (max-width: 768px). The last one is at the bottom.
# We can just append it at the end of the last @media query.

# Instead of complex regex, let's just append it to the <style> block, inside a new @media query!
# That ensures it overrides everything.
style_end = html.rfind("</style>")
if style_end != -1:
    html = html[:style_end] + "\n        @media (max-width: 768px) {\n" + css_fixes + "\n        }\n" + html[style_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Overflows fixed.")
