import re

with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

# The exact block we want to isolate
pattern = r"let p2pDealsInterval = null;.*?// Intercept tab switch to load deals\nconst origSwitchTab = switchTab;\nswitchTab = function\(tabId\) {\n    origSwitchTab\(tabId\);\n    if\(tabId === 'p2pdeals'\) {\n        loadP2PDeals\(\);\n    } else {\n        if\(p2pDealsInterval\) clearInterval\(p2pDealsInterval\);\n    }\n}\n"

# Find one instance of it to keep
blocks = re.findall(pattern, html, flags=re.DOTALL)
if not blocks:
    print("Block not found!")
else:
    block = blocks[0]
    # Remove all instances
    html = re.sub(pattern, "", html, flags=re.DOTALL)
    
    # We want to put it in the LAST <script> tag before </body>
    # Let's find the last </script> in the file
    last_script_idx = html.rfind('</script>')
    if last_script_idx != -1:
        html = html[:last_script_idx] + block + '\n' + html[last_script_idx:]
        
        with open('admin.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Cleaned up admin.html!")
    else:
        print("Could not find </script>")
