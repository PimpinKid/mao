import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# I will find the mobile CSS chunk we added and append the new rules before the closing brace.
# Since my last script added it like this:
#             .chat-window { width: calc(100% - 30px); right: 15px; left: 15px; bottom: 80px; height: 400px; }
#         }

target = ".chat-window { width: calc(100% - 30px); right: 15px; left: 15px; bottom: 80px; height: 400px; }"
new_rules = """
            .exchange-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
            .exchange-card:nth-child(3) { grid-column: span 2; }
            .exchange-card { padding: 12px; }
            .exchange-card .card-header { flex-direction: column; align-items: flex-start; gap: 8px; }
            .exchange-card .amount-input { font-size: 16px; padding: 10px; }
            .exchange-card .asset-tabs { gap: 4px; }
            .exchange-card .asset-tab { padding: 4px; font-size: 10px; }
            .coin-item { padding: 8px; gap: 6px; }
            .coin-icon { width: 24px; height: 24px; }
            .coin-name { font-size: 12px; }
            .coin-sub { font-size: 10px; }
            .selected-pill { padding: 4px 10px; font-size: 11px; }
"""

if target in html and "grid-column: span 2" not in html:
    html = html.replace(target, target + new_rules)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Exchange grid mobile CSS added.")
else:
    print("Already added or target missing.")

