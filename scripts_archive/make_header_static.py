import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove JS scroll listener
js_pattern = r"// Smart Sticky Header Effect.*?(?=\n\s*(// Custom Select Initialization|<script|function|</script>))"
html = re.sub(js_pattern, "", html, flags=re.DOTALL)

# 2. Remove .hide-smart class entirely
css_pattern_hide = r"header\.hide-smart\s*\{.*?\}"
html = re.sub(css_pattern_hide, "", html, flags=re.DOTALL)

# 3. Clean up the mobile header CSS so it's purely static
css_mobile_header_pattern = r"header\s*\{\s*position:\s*sticky\s*!important;\s*top:\s*0\s*!important;\s*transition:.*?!important;\s*flex-direction:\s*row\s*!important;\s*flex-wrap:\s*wrap\s*!important;\s*align-items:\s*center\s*!important;\s*padding:\s*10px\s*15px\s*!important;\s*gap:\s*5px\s*!important;\s*background:\s*rgba\(14,\s*9,\s*7,\s*0\.85\)\s*!important;\s*backdrop-filter:\s*blur\(12px\)\s*!important;\s*border-radius:\s*0\s*0\s*20px\s*20px\s*!important;\s*\}"

replacement = """header {
                position: sticky !important;
                top: 0 !important;
                flex-direction: row !important;
                flex-wrap: wrap !important;
                align-items: center !important;
                padding: 10px 15px !important;
                gap: 5px !important;
                background: rgba(14, 9, 7, 0.95) !important; /* Slightly darker to ensure readability when static */
                backdrop-filter: blur(12px) !important;
                border-radius: 0 0 20px 20px !important;
                z-index: 9999 !important;
                transform: none !important;
                transition: none !important;
            }
"""
html = re.sub(css_mobile_header_pattern, replacement, html, flags=re.DOTALL)

# Also remove header.scrolled from mobile if it exists
css_mobile_scrolled = r"header\.scrolled\s*\{\s*padding:\s*8px\s*15px\s*!important;\s*background:\s*rgba\(14,\s*9,\s*7,\s*0\.95\)\s*!important;\s*\}"
html = re.sub(css_mobile_scrolled, "", html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Header made completely static.")
