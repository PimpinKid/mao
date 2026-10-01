with open('index.html', 'r', encoding='utf-8') as f:
    js = f.read()

bad = """    let currentP2PRate = 0;
    let currentP2PType = 'buy';
    function openP2PCalculator(maker, rate, asset, fiat, type='buy') {
        document.getElementById('p2pCalcModal').classList.add('active');
        document.getElementById('p2p-calc-maker').innerText = maker;
        document.getElementById('p2p-calc-rate').innerText = rate + ' ' + fiat;
        document.getElementById('p2p-calc-asset').innerText = asset;
        document.getElementById('p2p-calc-action').innerText = type === 'sell' ? 'Продажа' : 'Покупка';
        
        currentP2PRate = rate;
        currentP2PType = type;"""

good = """    let currentP2PRate = 0;
    let currentP2PType = 'buy';
    let currentP2PMaker = '';
    let currentP2PAsset = '';
    let currentP2PFiat = '';
    
    function openP2PCalculator(maker, rate, asset, fiat, type='buy') {
        document.getElementById('p2pCalcModal').classList.add('active');
        document.getElementById('p2p-calc-maker').innerText = maker;
        document.getElementById('p2p-calc-rate').innerText = rate + ' ' + fiat;
        document.getElementById('p2p-calc-asset').innerText = asset;
        document.getElementById('p2p-calc-action').innerText = type === 'sell' ? 'Продажа' : 'Покупка';
        
        currentP2PRate = rate;
        currentP2PType = type;
        currentP2PMaker = maker;
        currentP2PAsset = asset;
        currentP2PFiat = fiat;"""

if bad in js:
    js = js.replace(bad, good)
    print("Replaced variables successfully")

bad2 = """    function openP2PTrade() {
        alert('Переход в защищенный чат сделки...');
        closeP2PCalculator();
    }"""

good2 = """    let currentDealId = null;
    let p2pChatInterval = null;

    function openP2PTrade() {
        const giveInput = document.getElementById('p2p-calc-give').value;
        const getInput = document.getElementById('p2p-calc-get').value;
        
        if(!giveInput || !getInput) {
            alert('Введите сумму');
            return;
        }
        
        fetch('/api/p2p/deals', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                maker_name: currentP2PMaker,
                rate: currentP2PRate,
                asset: currentP2PAsset,
                fiat: currentP2PFiat,
                type: currentP2PType,
                amount_give: parseFloat(giveInput),
                amount_get: parseFloat(getInput)
            })
        }).then(r=>r.json()).then(data => {
            if(data.success) {
                closeP2PCalculator();
                openDealChat(data.deal_id, currentP2PMaker);
            } else {
                alert(data.error || 'Ошибка. Вы авторизованы?');
            }
        }).catch(err => {
            alert('Ошибка сети');
        });
    }

    function openDealChat(dealId, makerName) {
        currentDealId = dealId;
        document.getElementById('p2pChatModal').classList.add('active');
        document.getElementById('p2p-chat-maker').innerText = makerName;
        
        loadP2PMessages();
        if(p2pChatInterval) clearInterval(p2pChatInterval);
        p2pChatInterval = setInterval(loadP2PMessages, 3000);
    }
    
    function closeDealChat() {
        document.getElementById('p2pChatModal').classList.remove('active');
        if(p2pChatInterval) clearInterval(p2pChatInterval);
        currentDealId = null;
    }

    function loadP2PMessages() {
        if(!currentDealId) return;
        fetch('/api/p2p/deals/' + currentDealId + '/messages', { headers: getAuthHeaders() })
        .then(r=>r.json())
        .then(data => {
            if(data.error) return;
            const container = document.getElementById('p2p-chat-messages');
            container.innerHTML = '';
            data.forEach(msg => {
                const isMine = msg.sender_type === 'taker';
                const div = document.createElement('div');
                div.className = 'chat-message ' + (isMine ? 'mine' : 'theirs');
                div.innerText = msg.message;
                container.appendChild(div);
            });
            container.scrollTop = container.scrollHeight;
        });
    }
    
    function sendP2PMessage() {
        if(!currentDealId) return;
        const input = document.getElementById('p2p-chat-input');
        const text = input.value.trim();
        if(!text) return;
        
        fetch('/api/p2p/deals/' + currentDealId + '/messages', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ message: text })
        }).then(r=>r.json()).then(data => {
            if(data.success) {
                input.value = '';
                loadP2PMessages();
            }
        });
    }"""

if bad2 in js:
    js = js.replace(bad2, good2)
    print("Replaced openP2PTrade successfully")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(js)
