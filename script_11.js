
// Web Audio API Sounds
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioInitialized = false;
window.addEventListener('click', () => { if(!audioInitialized) { audioCtx.resume(); audioInitialized = true; } });

function playBeep(type) {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'chat') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'alert') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    }
}

let activeDealInterval = null;
let dealTimerSeconds = 900;
window.currentDealIsMaker = false;

function updateDealTimer() {
    if (dealTimerSeconds <= 0) {
        document.getElementById('p2p-deal-timer').innerText = 'Время истекло';
        document.getElementById('p2p-deal-timer').style.color = 'var(--text-muted)';
        if(activeDealInterval) clearInterval(activeDealInterval);
        return;
    }
    dealTimerSeconds--;
    const m = Math.floor(dealTimerSeconds / 60);
    const s = dealTimerSeconds % 60;
    const el = document.getElementById('p2p-deal-timer');
    if (!el) return;
    el.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    if (dealTimerSeconds > 300) el.style.color = 'var(--green)';
    else if (dealTimerSeconds > 120) el.style.color = 'var(--yellow)';
    else {
        el.style.color = 'var(--red)';
        if (dealTimerSeconds % 2 === 0) el.style.opacity = '0.5';
        else el.style.opacity = '1';
    }
}

function openMyAdsModal() {
    window.location.hash = 'my-ads';
    document.getElementById('myAdsModal').classList.add('active');
    loadMyAds();
}

function loadMyAds() {
    fetch('/api/p2p/my-ads', { headers: getAuthHeaders() })
    .then(r=>r.json()).then(data => {
        const list = document.getElementById('my-ads-list');
        if(data.error) { list.innerHTML = '<div style="color:var(--red)">' + data.error + '</div>'; return; }
        if(!data.length) { list.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px; opacity: 0.5;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg><div style="font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 5px;">Нет активных объявлений</div><div style="font-size: 12px;">Создайте объявление, чтобы стать мейкером.</div></div>'; return; }
        
        list.innerHTML = data.map(ad => {
            const isPaused = ad.status === 'paused';
            return `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <div style="font-weight:bold; color:#fff;">${ad.type === 'buy' ? 'Покупка' : 'Продажа'} ${ad.crypto} за ${ad.fiat}</div>
                    <div style="color:var(--accent-orange)">${ad.price} ${ad.fiat}</div>
                </div>
                <div style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">Лимиты: ${ad.min_limit} - ${ad.max_limit} ${ad.fiat} | Остаток: ${ad.available_amount} ${ad.crypto}</div>
                <div style="display:flex; gap:10px;">
                    <button onclick="toggleAdStatus(${ad.id})" style="flex:1; background: ${isPaused ? 'var(--green)' : 'rgba(255,255,255,0.1)'}; color:#fff; border:none; padding:8px; border-radius:6px; cursor:pointer;">
                        ${isPaused ? '▶ Возобновить' : '⏸ Пауза'}
                    </button>
                    <button onclick="deleteAd(${ad.id})" style="flex:1; background: rgba(239,68,68,0.2); color: var(--red); border:none; padding:8px; border-radius:6px; cursor:pointer;">
                        🗑 Удалить
                    </button>
                </div>
            </div>`;
        }).join('');
    });
}

function toggleAdStatus(id) {
    fetch('/api/p2p/ads/' + id + '/toggle', { method: 'POST', headers: getAuthHeaders() })
    .then(r=>r.json()).then(d => { if(d.success) loadMyAds(); });
}

async function deleteAd(id) {
    if(!(await window.maoConfirm('Удалить объявление навсегда?'))) return;
    fetch('/api/p2p/ads/' + id, { method: 'DELETE', headers: getAuthHeaders() })
    .then(r=>r.json()).then(d => { if(d.success) loadMyAds(); });
}

const originalHandleHash = window.handleHashState;
window.handleHashState = function() {
    if (originalHandleHash) originalHandleHash();
    if (window.location.hash === '#my-ads') {
        document.getElementById('myAdsModal').classList.add('active');
        loadMyAds();
    }
};

window.sendRequisiteToChat = function(text) {
    const input = document.getElementById('p2p-chat-input');
    input.value = text;
    sendP2PMessage();
    showToast('Реквизиты отправлены в чат!', 'success');
};
