import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add global max-width and overflow fixes for mobile to prevent any horizontal scrolling
viewport_fixes = """
            /* HORIZONTAL SCROLL & VIEWPORT FIXES */
            html, body { 
                overflow-x: hidden !important; 
                width: 100% !important; 
                max-width: 100vw !important; 
                margin: 0 !important; 
            }
            .container { 
                padding-left: 15px !important; 
                padding-right: 15px !important; 
                max-width: 100vw !important;
                overflow-x: hidden !important;
            }
            .exchange-grid { gap: 8px !important; width: 100% !important; }
            .exchange-card { min-width: 0 !important; overflow: hidden !important; }
            .coin-left { min-width: 0 !important; overflow: hidden !important; }
            .coin-name { white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; }
            .amount-input { min-width: 0 !important; width: 100% !important; }
            
            /* Fix Ticker Position */
            .live-ticker { 
                left: 0 !important; 
                right: 0 !important;
                width: 100vw !important;
                margin: 0 !important;
            }
"""

if "/* HORIZONTAL SCROLL & VIEWPORT FIXES */" not in html:
    # Inject right inside the @media (max-width: 768px) block at the bottom
    html = html.replace(".user-dropdown-container { order: 4 !important; margin-left: auto !important; }", 
                        ".user-dropdown-container { order: 4 !important; margin-left: auto !important; }\n" + viewport_fixes)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Viewport fixes applied.")
else:
    print("Already fixed.")
