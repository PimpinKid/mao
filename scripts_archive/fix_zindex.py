import re

with open("index.html", "r") as f:
    html = f.read()

# Fix 1: Add z-index: 100; position: relative; to .p2p-filter-pill
css_pill_old = """        .p2p-filter-pill {
            display: flex; flex-wrap: wrap; gap: 15px; align-items: center;
            background: rgba(24, 16, 12, 0.5); border: 1px solid rgba(190, 120, 60, 0.15);
            backdrop-filter: var(--glass-blur); border-radius: 20px;
            padding: 15px 20px; margin-bottom: 30px; box-shadow: var(--glass-shadow);
        }"""
        
css_pill_new = """        .p2p-filter-pill {
            display: flex; flex-wrap: wrap; gap: 15px; align-items: center;
            background: rgba(24, 16, 12, 0.5); border: 1px solid rgba(190, 120, 60, 0.15);
            backdrop-filter: var(--glass-blur); border-radius: 20px;
            padding: 15px 20px; margin-bottom: 30px; box-shadow: var(--glass-shadow);
            position: relative; z-index: 100;
        }"""

if css_pill_old in html:
    html = html.replace(css_pill_old, css_pill_new)
    print("Fixed .p2p-filter-pill z-index")

# Fix 2: Add z-index: 1000; to .custom-select-dropdown just to be safe
css_dropdown_old = """    .custom-select-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        width: 100%;
        min-width: 160px;
        background: rgba(15, 10, 8, 0.85);"""

css_dropdown_new = """    .custom-select-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        width: 100%;
        min-width: 160px;
        background: rgba(15, 10, 8, 0.85);
        z-index: 1000;"""

if css_dropdown_old in html:
    html = html.replace(css_dropdown_old, css_dropdown_new)
    print("Fixed .custom-select-dropdown z-index")

with open("index.html", "w") as f:
    f.write(html)

