with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

bad = "['orders', 'chat', 'settings', 'reviews', 'p2p'].forEach"
good = "['orders', 'chat', 'settings', 'reviews', 'p2p', 'p2pdeals'].forEach"

if bad in html:
    html = html.replace(bad, good)
    with open('admin.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed switchTab")
else:
    print("Not found")
