with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = ".modal-subtitle { font-size: 12px !important; margin-bottom: 15px !important; }"
replacement = target + """
            
            .chat-window {
                width: calc(100% - 30px);
                right: 15px; left: 15px;
                bottom: 80px;
                height: 400px;
            }
"""

if target in html:
    html = html.replace(target, replacement)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Chat mobile CSS added.")
else:
    print("Could not find the target string.")
