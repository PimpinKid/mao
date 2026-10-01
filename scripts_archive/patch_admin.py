with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add "Чат с тейкером (P2P)" to the sidebar
sidebar_item = """<a href="#" onclick="switchTab('p2pdeals')" class="block py-2 px-4 rounded transition text-gray-400 hover:bg-gray-800 hover:text-white" id="tab-btn-p2pdeals">Чат с тейкером (P2P)</a>"""
if 'switchTab(\'p2pdeals\')' not in html:
    html = html.replace('id="tab-btn-support">Поддержка</a>', 'id="tab-btn-support">Поддержка</a>\n                ' + sidebar_item)

# 2. Add the UI section for P2P deals
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
    html = html.replace('<!-- End Support Tab -->', '<!-- End Support Tab -->\n' + deals_section)

# 3. Add Verified Toggle to P2P ads
verified_btn = """<button onclick="toggleVerifiedMaker(${ad.maker_id})" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm text-white">Выдать 'V'</button>"""
if 'toggleVerifiedMaker' not in html:
    html = html.replace('</div>\n            </td>\n        </tr>\n    `;', '    ' + verified_btn + '\n            </div>\n            </td>\n        </tr>\n    `;')

# 4. JS functions for Deals & Verification
js_funcs = """
let p2pDealsInterval = null;
let currentAdminDealId = null;

function loadP2PDeals() {
    fetch('/api/admin/p2p_deals', { headers: {'x-admin-token': getAdminToken()} })
    .then(r=>r.json())
    .then(data => {
        const list = document.getElementById('p2p-deals-list');
        if(!list) return;
        list.innerHTML = '';
        data.forEach(deal => {
            const div = document.createElement('div');
            div.className = `p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition ${deal.id === currentAdminDealId ? 'bg-gray-800' : ''}`;
            div.onclick = () => openAdminDealChat(deal.id, deal);
            div.innerHTML = `
                <div class="font-semibold text-white">Сделка #${deal.id}</div>
                <div class="text-sm text-gray-400">Тейкер: ${deal.taker_name}</div>
                <div class="text-sm text-orange-400 mt-1">${deal.type==='buy'?'Покупка':'Продажа'} ${deal.amount_crypto || '-'} ${deal.crypto || deal.asset || ''}</div>
            `;
            list.appendChild(div);
        });
    });
}

function openAdminDealChat(dealId, deal) {
    currentAdminDealId = dealId;
    document.getElementById('p2p-deal-active-info').innerText = `Сделка #${dealId} | Тейкер: ${deal.taker_name}`;
    document.getElementById('p2p-deal-input').disabled = false;
    document.getElementById('p2p-deal-send').disabled = false;
    
    loadAdminDealMessages();
    if(p2pDealsInterval) clearInterval(p2pDealsInterval);
    p2pDealsInterval = setInterval(loadAdminDealMessages, 3000);
    
    // Highlight active in list
    Array.from(document.getElementById('p2p-deals-list').children).forEach(el => el.classList.remove('bg-gray-800'));
    // Reload list to apply highlight class (lazy way)
    loadP2PDeals();
}

function loadAdminDealMessages() {
    if(!currentAdminDealId) return;
    fetch(`/api/p2p/deals/${currentAdminDealId}/messages`, { headers: {'x-admin-token': getAdminToken(), ...getAuthHeaders()} })
    .then(r=>r.json())
    .then(data => {
        const container = document.getElementById('p2p-deal-messages');
        if(!container || data.error) return;
        container.innerHTML = '';
        data.forEach(msg => {
            const isMine = msg.sender_type === 'maker_admin';
            const div = document.createElement('div');
            div.className = `max-w-[80%] p-3 rounded-lg text-sm ${isMine ? 'bg-orange-500 text-black self-end rounded-br-none' : 'bg-gray-800 text-white self-start rounded-bl-none'}`;
            div.innerText = msg.message;
            container.appendChild(div);
        });
        container.scrollTop = container.scrollHeight;
    });
}

function sendAdminP2PMessage() {
    if(!currentAdminDealId) return;
    const input = document.getElementById('p2p-deal-input');
    const text = input.value.trim();
    if(!text) return;
    
    fetch(`/api/admin/p2p_deals/${currentAdminDealId}/messages`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'x-admin-token': getAdminToken()},
        body: JSON.stringify({ message: text })
    }).then(r=>r.json()).then(data => {
        if(data.success) {
            input.value = '';
            loadAdminDealMessages();
        }
    });
}

function toggleVerifiedMaker(userId) {
    fetch(`/api/admin/users/${userId}/verify_trader`, {
        method: 'POST',
        headers: {'x-admin-token': getAdminToken()}
    }).then(r=>r.json()).then(data => {
        if(data.success) {
            alert('Статус Verified (V) изменен!');
            loadP2PAds();
        }
    });
}

// Intercept tab switch to load deals
const origSwitchTab = switchTab;
switchTab = function(tabId) {
    origSwitchTab(tabId);
    if(tabId === 'p2pdeals') {
        loadP2PDeals();
    } else {
        if(p2pDealsInterval) clearInterval(p2pDealsInterval);
    }
}
"""

if 'toggleVerifiedMaker' not in html:
    html = html.replace('</script>', js_funcs + '\n</script>')

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)
