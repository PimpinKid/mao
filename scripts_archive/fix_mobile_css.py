with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = ".modal-subtitle { font-size: 12px !important; margin-bottom: 15px !important; }"
replacement = target + """
            .advantages-grid { grid-template-columns: 1fr; gap: 12px; }
            .bottom-grid-three { gap: 12px; }
"""

if target in html and ".advantages-grid { grid-template-columns: 1fr; gap: 12px; }" not in html:
    html = html.replace(target, replacement)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Advantages grid mobile CSS added.")
else:
    print("Already added or target missing.")
