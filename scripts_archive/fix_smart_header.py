import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Ensure header has transition for transform
if "transition: transform 0.3s ease" not in html:
    html = html.replace("header { \n                position: sticky !important;",
                        "header { \n                transition: transform 0.3s ease, padding 0.3s ease, background 0.3s ease !important;\n                position: sticky !important;")

# 2. Update JS for scroll
old_js = """    // Sticky Header Effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });"""

new_js = """    // Smart Sticky Header Effect (Hide on scroll down, show on scroll up)
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const currentScroll = window.scrollY;
        
        if (currentScroll > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        if (currentScroll > lastScrollY && currentScroll > 100) {
            // Скролл вниз - прячем шапку уезжая вверх
            header.style.transform = 'translateY(-150%)';
        } else {
            // Скролл вверх - показываем шапку
            header.style.transform = 'translateY(0)';
        }
        lastScrollY = currentScroll;
    });"""

if "lastScrollY = window.scrollY;" not in html:
    html = html.replace(old_js, new_js)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Smart header applied.")
