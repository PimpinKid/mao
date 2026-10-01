import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

js_scroll = """    // Sticky Header Effect (Desktop)
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (!header) return;
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Custom Select Initialization"""

if "Sticky Header Effect" not in html:
    html = html.replace("// Custom Select Initialization", js_scroll)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Desktop scroll restored.")
