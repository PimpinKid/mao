import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix header language wrapper
html = html.replace("#lang-select { order: 2; margin-right: auto; }", ".header-right .custom-select-wrapper { order: 2; margin-right: auto; }")
html = html.replace("header { flex-direction: row; flex-wrap: wrap; justify-content: space-between; gap: 15px; padding: 15px 0; }", "header { flex-direction: row; flex-wrap: wrap; justify-content: space-between; gap: 10px; padding: 5px 0; margin-bottom: 10px; }")


target = ".hero-section .hero-title { font-size: 32px; }"
new_hero = ".hero-section { padding: 20px 15px; margin-bottom: 15px; flex-direction: column; text-align: center; gap: 20px; }\n            .hero-section .hero-visual { position: static; width: 100px; height: 100px; margin: 0 auto; }\n            .hero-section .hero-title { font-size: 32px; }"
if target in html and "hero-section { padding: 20px 15px" not in html:
    html = html.replace(target, new_hero)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Hero spacing and header fixed.")

