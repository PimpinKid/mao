import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

chat_modal = """
    <!-- P2P Chat Modal -->
    <div class="modal-overlay" id="p2pChatModal">
        <div class="modal-box" style="max-width: 500px; padding: 0; background: #13151b; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; display: flex; flex-direction: column; height: 600px;">
            <div style="padding: 15px 25px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; background: #1b1e28;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(229, 142, 56, 0.1); display: flex; align-items: center; justify-content: center; color: var(--accent-orange);">
                        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path></svg>
                    </div>
                    <div>
                        <div style="font-size: 16px; font-weight: 700; color: #fff;">Чат сделки</div>
                        <div style="font-size: 12px; color: var(--text-muted);">Мейкер: <span id="p2p-chat-maker" style="color:var(--accent-orange)"></span></div>
                    </div>
                </div>
                <span class="modal-close" style="position: static; margin: 0; cursor: pointer; padding: 5px;" onclick="closeDealChat()">✕</span>
            </div>
            
            <div id="p2p-chat-messages" style="flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; background: #080504;">
                <div style="text-align: center; color: var(--text-muted); font-size: 12px; margin-bottom: 10px;">Чат с мейкером открыт. Ожидайте реквизиты.</div>
            </div>
            
            <div style="padding: 15px; background: #1b1e28; border-top: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="p2p-chat-input" placeholder="Введите сообщение..." style="flex: 1; background: #13151b; border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 12px 15px; color: #fff; font-size: 14px; outline: none;">
                    <button onclick="sendP2PMessage()" style="background: var(--accent-orange); color: #000; border: none; border-radius: 8px; padding: 0 20px; font-weight: 600; cursor: pointer;">
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="margin-top:2px"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
"""

if 'id="p2pChatModal"' not in html:
    html = html.replace('</body>', chat_modal + '\n</body>')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Added chat modal")
else:
    print("Chat modal already exists")
