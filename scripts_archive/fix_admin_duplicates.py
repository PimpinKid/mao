import re

with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

# The injected block starts with "let p2pDealsInterval = null;"
# We want to keep only one instance of the JS functions block.
pattern = r"let p2pDealsInterval = null;.*?if\(p2pDealsInterval\) clearInterval\(p2pDealsInterval\);\n    }\n}\n"

blocks = re.findall(pattern, html, re.DOTALL)
print(f"Found {len(blocks)} injected blocks")

if len(blocks) > 1:
    # Remove all of them
    html = re.sub(pattern, "", html, flags=re.DOTALL)
    # Put one back right before </script>
    html = html.replace('</script>', blocks[0] + '\n</script>')

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)
