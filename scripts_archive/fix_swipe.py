import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

css_addition = """
            /* HORIZONTAL SWIPE GRIDS FOR MOBILE */
            .bottom-grid-top, .advantages-grid {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                overflow-x: auto !important;
                overflow-y: hidden !important;
                scroll-snap-type: x mandatory !important;
                -webkit-overflow-scrolling: touch;
                gap: 15px !important;
                padding-bottom: 5px !important;
            }
            .bottom-grid-top::-webkit-scrollbar, .advantages-grid::-webkit-scrollbar {
                display: none;
            }
            .bottom-grid-top .module-card {
                min-width: 90% !important;
                width: 90% !important;
                max-width: 90% !important;
                scroll-snap-align: start !important;
                flex-shrink: 0 !important;
            }
            .advantages-grid .adv-card {
                min-width: 75% !important;
                width: 75% !important;
                max-width: 75% !important;
                scroll-snap-align: start !important;
                flex-shrink: 0 !important;
            }
"""

if "HORIZONTAL SWIPE GRIDS FOR MOBILE" not in html:
    html = html.replace("/* COMPACT BYBIT-STYLE P2P CARDS */", css_addition + "\n            /* COMPACT BYBIT-STYLE P2P CARDS */")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Swipe grids added.")
