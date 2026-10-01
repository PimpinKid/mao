import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

bad_div = """<div id="p2p-chat-messages" style="flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; background: #080504;">"""

good_div = """
            <div style="background: rgba(229,142,56,0.1); padding: 12px 20px; border-bottom: 1px solid rgba(229,142,56,0.2); display: flex; gap: 12px; align-items: center;">
                <svg width="20" height="20" fill="none" stroke="var(--accent-orange)" stroke-width="2"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div style="font-size: 13px; color: #fff; line-height: 1.4;">Мы уже уведомили мейкера о новом ордере.<br><span style="color:var(--text-muted)">Ожидайте, скоро он подключится и пришлёт реквизиты.</span></div>
            </div>
            <div id="p2p-chat-messages" style="flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; background: #080504;">
"""

if "Мы уже уведомили мейкера" not in html:
    html = html.replace(bad_div, good_div)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Added sticky notice")

