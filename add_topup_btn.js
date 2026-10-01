const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const oldBal = `<div id="header-balance-display" style="display: none; background: var(--card-bg); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 6px; font-family: monospace; font-size: 13px; font-weight: bold; color: #fff; align-items: center; gap: 6px;">
                    <span id="header-balance-rub" style="color: var(--green);">0.00</span> RUB
                </div>`;

const newBal = `<div id="header-balance-display" style="display: none; align-items: center; gap: 8px;">
                    <div style="background: var(--card-bg); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 6px; font-family: monospace; font-size: 13px; font-weight: bold; color: #fff; display: flex; align-items: center; gap: 6px;">
                        <span id="header-balance-rub" style="color: var(--green);">0.00</span> RUB
                    </div>
                    <button class="btn-outline" style="width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--accent-orange); color: var(--accent-orange); background: rgba(229, 142, 56, 0.1); display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900; cursor: pointer; transition: 0.2s; padding: 0; line-height: 1;" onclick="openTopupModal()" title="Пополнить баланс" onmouseover="this.style.background='var(--accent-orange)'; this.style.color='#000';" onmouseout="this.style.background='rgba(229, 142, 56, 0.1)'; this.style.color='var(--accent-orange)';">+</button>
                </div>`;

content = content.replace(oldBal, newBal);

// Now let's inject the openTopupModal logic and HTML
const topupModalHtml = `
    <!-- TOPUP MODAL -->
    <div class="modal-overlay" id="topupModal" onclick="if(event.target===this) this.classList.remove('active')">
        <div class="modal-box" style="max-width: 400px; padding: 24px; background: #14100d; border: 1px solid var(--card-border); border-radius: 16px; position: relative;">
            <span class="modal-close" onclick="document.getElementById('topupModal').classList.remove('active')" style="top: 20px; right: 20px; position: absolute; cursor: pointer; color: var(--text-muted); font-size: 20px;">✕</span>
            
            <div style="font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(229, 142, 56, 0.15); display: flex; align-items: center; justify-content: center; color: var(--accent-orange);">
                    +
                </div>
                Пополнение баланса
            </div>
            
            <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">
                Введите сумму в рублях (RUB), на которую вы хотите пополнить внутренний баланс. После нажатия "Продолжить", вам будут выданы реквизиты для перевода.
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Сумма пополнения (RUB)</label>
                <div style="position: relative;">
                    <input type="number" id="topup-amount" class="auth-input" placeholder="10000" style="width: 100%; box-sizing: border-box; padding: 14px 14px 14px 45px; font-size: 16px; border-radius: 8px;">
                    <span style="position: absolute; left: 14px; top: 14px; color: var(--green); font-weight: 800; font-family: monospace;">₽</span>
                </div>
            </div>

            <button class="btn-submit" onclick="submitTopup()" style="width: 100%; padding: 14px; border-radius: 8px; font-size: 15px;">Продолжить ➔</button>
        </div>
    </div>
    
    <script>
        function openTopupModal() {
            document.getElementById('topupModal').classList.add('active');
            document.getElementById('topup-amount').value = '';
            document.getElementById('topup-amount').focus();
        }
        async function submitTopup() {
            const amount = document.getElementById('topup-amount').value;
            if(!amount || amount < 500) {
                window.alert('Минимальная сумма пополнения 500 RUB');
                return;
            }
            try {
                // Backend integration
                const res = await fetch('/api/user/topup', {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ amount: parseFloat(amount) })
                });
                const data = await res.json();
                if(data.success) {
                    document.getElementById('topupModal').classList.remove('active');
                    window.alert('Заявка на пополнение создана! В ближайшее время менеджер свяжется с вами для выдачи реквизитов (СБП/Карта). ID заявки: ' + data.orderId);
                } else {
                    window.alert(data.error || 'Ошибка при создании заявки');
                }
            } catch(e) {
                window.alert('Ошибка сети: ' + e.message);
            }
        }
    </script>
`;

content = content.replace('<!-- FOOTER END -->', '<!-- FOOTER END -->\n\n' + topupModalHtml);

fs.writeFileSync('index.html', content);
