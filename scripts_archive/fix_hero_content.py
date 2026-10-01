with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = ".hero-section { padding: 20px 15px; margin-bottom: 15px; flex-direction: column; text-align: center; gap: 20px; }"
new_target = target + "\n            .hero-section .hero-content { max-width: 100%; }"

if target in html and "hero-content { max-width: 100%; }" not in html:
    html = html.replace(target, new_target)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Hero content width fixed.")
else:
    print("Already fixed or target missing.")
