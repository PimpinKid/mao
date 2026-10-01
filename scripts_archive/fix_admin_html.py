with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

sidebar_item = """<button onclick="switchTab('p2pdeals')" id="nav-p2pdeals" class="nav-item w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg text-gray-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    Чат с тейкером
                </button>"""
if 'switchTab(\'p2pdeals\')' not in html:
    html = html.replace('id="nav-chat"', 'id="nav-chat"').replace('</nav>', sidebar_item + '\n            </nav>')

deals_section = """
        <div id="tab-p2pdeals" class="tab-content hidden">
            <h2 class="text-2xl font-bold mb-6 text-white">Чат с тейкером (P2P)</h2>
            <div class="flex h-[600px] bg-[#1a1c23] rounded-lg border border-gray-800 overflow-hidden">
                <div class="w-1/3 border-r border-gray-800 flex flex-col">
                    <div class="p-4 border-b border-gray-800 bg-[#13151b] font-semibold text-white">Активные сделки</div>
                    <div id="p2p-deals-list" class="flex-1 overflow-y-auto">
                        <!-- Loaded via JS -->
                    </div>
                </div>
                <div class="w-2/3 flex flex-col bg-[#0b0c10]">
                    <div class="p-4 border-b border-gray-800 bg-[#13151b] font-semibold text-white flex justify-between">
                        <span>Чат сделки</span>
                        <span id="p2p-deal-active-info" class="text-gray-400 text-sm"></span>
                    </div>
                    <div id="p2p-deal-messages" class="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                        <div class="text-center text-gray-500 mt-10">Выберите сделку слева</div>
                    </div>
                    <div class="p-4 bg-[#13151b] border-t border-gray-800 flex gap-2">
                        <input type="text" id="p2p-deal-input" class="flex-1 bg-[#1a1c23] border border-gray-700 rounded px-4 py-2 text-white outline-none focus:border-orange-500 disabled:opacity-50" placeholder="Написать тейкеру (вы мейкер)..." disabled>
                        <button id="p2p-deal-send" onclick="sendAdminP2PMessage()" class="bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-6 rounded transition disabled:opacity-50" disabled>Отправить</button>
                    </div>
                </div>
            </div>
        </div>
"""
if 'id="tab-p2pdeals"' not in html:
    # insert before the closing main tag
    html = html.replace('</main>', deals_section + '\n    </main>')

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)
