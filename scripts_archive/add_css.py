with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

css = """
.chat-message { max-width: 80%; padding: 10px 15px; border-radius: 12px; font-size: 14px; word-wrap: break-word; }
.chat-message.mine { background: var(--accent-orange); color: #000; align-self: flex-end; border-bottom-right-radius: 4px; }
.chat-message.theirs { background: #1b1e28; color: #fff; align-self: flex-start; border-bottom-left-radius: 4px; }
"""

if '.chat-message.mine' not in html:
    html = html.replace('</style>', css + '\n</style>')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
