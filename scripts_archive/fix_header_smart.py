import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update the CSS for the mobile header
# We use regex to safely find the mobile header block
pattern_css = r"header\s*\{\s*position:\s*sticky\s*!important;\s*top:\s*0\s*!important;"
replacement_css = "header {\n                position: sticky !important;\n                top: 0 !important;\n                transition: transform 0.4s ease, top 0.4s ease, padding 0.4s ease, background 0.4s ease !important;"
html = re.sub(pattern_css, replacement_css, html)

# Add hide-smart class if not exists
if ".hide-smart" not in html:
    html = html.replace("header.scrolled {", "header.hide-smart {\n                transform: translateY(-120%) !important;\n            }\n            header.scrolled {")

# 2. Update JS
js_pattern = r"// Smart Sticky Header Effect.*?lastScrollY = currentScroll;\n    \}\);"
js_replacement = """// Smart Sticky Header Effect (Hide on scroll down, show on scroll up)
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (!header) return;
        const currentScroll = window.scrollY;
        
        if (currentScroll > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        if (currentScroll > lastScrollY && currentScroll > 100) {
            header.classList.add('hide-smart');
        } else {
            header.classList.remove('hide-smart');
        }
        lastScrollY = currentScroll;
    });"""
html = re.sub(js_pattern, js_replacement, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Smart header CSS and JS fixed.")
