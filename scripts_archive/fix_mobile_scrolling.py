import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = ".chat-window { width: calc(100% - 30px); right: 15px; left: 15px; bottom: 80px; height: 400px; }"
new_rules = """
            header.scrolled { position: static !important; padding: 5px 0 !important; background: transparent !important; backdrop-filter: none !important; border: none !important; border-radius: 0 !important; }
            header { position: static !important; }
            .activity-table { font-size: 11px; }
            .activity-table th, .activity-table td { padding: 6px 2px; white-space: nowrap; }
            .status-badge { font-size: 9px; padding: 2px 4px; }
"""

if target in html and "header.scrolled { position: static !important" not in html:
    html = html.replace(target, target + new_rules)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Scroll and wrap fixes applied.")
else:
    print("Already added or target missing.")
