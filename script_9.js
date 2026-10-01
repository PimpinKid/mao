
function openMyDealsModal() {
    document.getElementById('myDealsModal').classList.add('active');
    fetch('/api/p2p/my-deals', { headers: getAuthHeaders() })
    .then(r => r.json())
    .then(data => {
        const list = document.getElementById('my-deals-list');
        if (data.error) {
            list.innerHTML = '<div style="color: var(--red);">' + data.error + '</div>';
            return;
        }
        if (!data || data.length === 0) {
            list.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px; opacity: 0.5;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg><div style="font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 5px;">У вас пока нет активных сделок</div><div style="font-size: 12px;">Откликнитесь на объявление или создайте свое.</div></div>';
            return;
        }
        list.innerHTML = data.map(d => `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: 700; margin-bottom: 5px; color: #fff;">Сделка #${d.id} (${d.type === 'buy' ? 'Покупка' : 'Продажа'} ${d.asset})</div>
                    <div style="font-size: 12px; color: var(--text-muted);">
                        Сумма: ${d.amount_fiat} ${d.fiat} | Статус: <span style="color: var(--accent-orange);">${d.escrow_step || d.status}</span>
                    </div>
                </div>
                <button onclick="openDealChat(${d.id}, '${d.maker_name}'); document.getElementById('myDealsModal').classList.remove('active');" style="background: var(--accent-orange); color: #000; border: none; padding: 8px 15px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 13px;">
                    Перейти
                </button>
            </div>
        `).join('');
    });
}
