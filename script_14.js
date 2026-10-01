
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
    