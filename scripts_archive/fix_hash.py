with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace("['orders', 'chat', 'settings', 'reviews', 'p2p'].includes(hash)", "['orders', 'chat', 'settings', 'reviews', 'p2p', 'p2pdeals'].includes(hash)")

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)
