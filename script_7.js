
function submitP2PAd() {
    const type = document.getElementById('ad-type').value;
    const crypto = document.getElementById('ad-crypto').value;
    const fiat = document.getElementById('ad-fiat').value;
    const price = parseFloat(document.getElementById('ad-price').value);
    const min_limit = parseFloat(document.getElementById('ad-min').value);
    const max_limit = parseFloat(document.getElementById('ad-max').value);
    const available_amount = parseFloat(document.getElementById('ad-available').value);
    const pmCheckboxes = document.querySelectorAll('input[name="ad-pm"]:checked');
    const payment_methods = Array.from(pmCheckboxes).map(cb => cb.value);
    const errBox = document.getElementById('createAdError');
    
    if(!price || !min_limit || !max_limit || !available_amount || payment_methods.length === 0) {
        errBox.innerText = 'Пожалуйста, заполните все поля и выберите минимум 1 метод оплаты.';
        errBox.style.display = 'block';
        return;
    }
    
    const btn = document.getElementById('btn-submit-ad');
    const originalText = btn.innerText;
    btn.innerText = 'Отправка...';
    btn.disabled = true;
    
    fetch('/api/p2p/ads', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ type, crypto, fiat, price, min_limit, max_limit, available_amount, payment_methods })
    })
    .then(r => r.json())
    .then(data => {
        btn.innerText = originalText;
        btn.disabled = false;
        if(data.success) {
            showToast(typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Ad submitted for review!' : 'Объявление успешно создано и отправлено на модерацию!', 'success');
            document.getElementById('createAdModal').classList.remove('active');
            errBox.style.display = 'none';
        } else {
            errBox.innerText = data.error || 'Произошла ошибка';
            errBox.style.display = 'block';
        }
    })
    .catch(err => {
        btn.innerText = originalText;
        btn.disabled = false;
        errBox.innerText = 'Сетевая ошибка';
        errBox.style.display = 'block';
    });
}
