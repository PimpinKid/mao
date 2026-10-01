import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = """            header { flex-direction: column; gap: 15px; padding: 15px 0; }
            .header-center-nav { position: relative !important; transform: none !important; left: auto !important; width: 100%; justify-content: center; gap: 15px; padding: 10px; overflow-x: auto; }
            .logo { justify-content: center; width: 100%; }
            .header-right { width: 100%; justify-content: space-between; }"""

new_header = """            header { flex-direction: row; flex-wrap: wrap; justify-content: space-between; gap: 15px; padding: 15px 0; }
            .logo { width: 100%; justify-content: center; order: 1; }
            .header-right { display: contents; }
            #lang-select { order: 2; margin-right: auto; }
            .header-center-nav { position: relative !important; transform: none !important; left: auto !important; order: 3; flex: 1; justify-content: center; gap: 10px; padding: 0; width: auto; overflow: visible; }
            .nav-link { font-size: 14px; padding: 8px 16px; }
            .user-dropdown-container { order: 4; margin-left: auto; }"""

if target in html:
    html = html.replace(target, new_header)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Header CSS updated.")
else:
    print("Target not found.")

