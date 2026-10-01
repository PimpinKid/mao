import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove the static !important rules I added
html = html.replace("header.scrolled { position: static !important; padding: 5px 0 !important; background: transparent !important; backdrop-filter: none !important; border: none !important; border-radius: 0 !important; }", "")
html = html.replace("header { position: static !important; }", "")

# We need to make sure we don't have multiple conflicting mobile header rules.
# Let's completely clean up the mobile header block by replacing the old rules.
# Find where .header-right { display: contents !important; } is.
# We will inject the new rules right at the very end of the <style> block to override everything!

new_mobile_rules = """
        @media (max-width: 768px) {
            html { font-size: clamp(14px, 4vw, 16px); }
            
            header { 
                position: sticky !important; 
                top: 38px !important; 
                flex-direction: row !important; 
                flex-wrap: wrap !important;
                align-items: center !important;
                padding: 10px 15px !important;
                gap: 5px !important;
                background: rgba(14, 9, 7, 0.85) !important;
                backdrop-filter: blur(12px) !important;
                border-radius: 0 0 20px 20px !important;
            }
            
            header.scrolled {
                padding: 8px 15px !important;
                background: rgba(14, 9, 7, 0.95) !important;
            }

            .logo { width: 100% !important; order: 1 !important; justify-content: center !important; margin-bottom: 5px !important; }
            .logo svg { height: 26px !important; width: 26px !important; }
            .logo-text { font-size: 16px !important; }

            .header-right { display: contents !important; }
            
            #lang-toggle-btn { 
                order: 2 !important; 
                margin-right: auto !important; 
                padding: 6px 12px !important; 
                font-size: 11px !important;
            }
            
            .header-center-nav { 
                order: 3 !important; 
                position: relative !important; 
                transform: none !important; 
                left: auto !important; 
                display: flex !important;
                gap: 5px !important;
                padding: 0 !important;
                margin: 0 auto !important;
                width: auto !important;
            }
            .nav-link { font-size: 12px !important; padding: 6px 10px !important; }
            
            .user-dropdown-container { order: 4 !important; margin-left: auto !important; }
            .btn-login { padding: 6px 12px !important; font-size: 12px !important; }
            
            .hero-section .hero-title { font-size: clamp(24px, 7vw, 32px) !important; }
            .p2p-hero-title { font-size: clamp(24px, 7vw, 32px) !important; }
        }
"""

html = html.replace("</style>", new_mobile_rules + "\n</style>")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Header completely overhauled.")
