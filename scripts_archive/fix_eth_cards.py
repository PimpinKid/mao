import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Pattern to remove all ETH cards I generated
pattern = r'<div class="p2p-bento-card" data-coin="ETH" style="display: none;">.*?<button class="[^"]+" onclick="openP2PCalculator[^>]+>[^<]+</button>\s*</div>\s*</div>'
html = re.sub(pattern, '', html, flags=re.DOTALL)

# Now I'll regenerate them
raw_text = """* **Мерчант:** Алекс | **Статистика:** 3628 исполнено | 100% | 2мин. | **Цена:** 241 430,00 RUB | **Доступно:** 0,28986864 ETH | **Лимиты:** 2000,00 ~ 69 982,98 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные
* **Мерчант:** ruxaa | **Статистика:** 567 исполнено | 99% | 2мин. | **Цена:** 235 608,93 RUB | **Доступно:** 0,65604098 ETH | **Лимиты:** 20 000,00 ~ 154 569,11 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные
* **Мерчант:** Wins! | **Статистика:** 813 исполнено | 98% | 6мин. | **Цена:** 235 611,93 RUB | **Доступно:** 0,47210486 ETH | **Лимиты:** 45 000,00 ~ 111 233,53 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные
* **Мерчант:** GuardEx | **Статистика:** 57 исполнено | 96% | **Цена:** 235 629,97 RUB | **Доступно:** 2,00000000 ETH | **Лимиты:** 30 000,00 ~ 471 259,94 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** GTA | **Статистика:** 496 исполнено | 100% | 4мин. | **Цена:** 235 630,00 RUB | **Доступно:** 0,89854856 ETH | **Лимиты:** 20 000,00 ~ 211 724,99 RUB | **Методы оплаты:** Mobile Top-up, Bank Transfer
* **Мерчант:** Wins! | **Статистика:** 813 исполнено | 98% | 6мин. | **Цена:** 235 640,40 RUB | **Доступно:** 0,88872780 ETH | **Лимиты:** 25 000,00 ~ 209 420,17 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные
* **Мерчант:** BADRIK | **Статистика:** 109 исполнено | 99% | 8мин. | **Цена:** 236 781,00 RUB | **Доступно:** 0,99767648 ETH | **Лимиты:** 20 000,00 ~ 236 230,83 RUB | **Методы оплаты:** Mobile Top-up, Bank Transfer
* **Мерчант:** monty.mcqueen | **Статистика:** 605 исполнено | 97% | 8мин. | **Цена:** 236 900,00 RUB | **Доступно:** 0,47507574 ETH | **Лимиты:** 10 000,00 ~ 112 545,44 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** xorya | **Статистика:** 366 исполнено | 100% | 6мин. | **Цена:** 240 000,00 RUB | **Доступно:** 1,49670446 ETH | **Лимиты:** 40 000,00 ~ 150 000,00 RUB | **Методы оплаты:** Bank Transfer
* **Мерчант:** GTA | **Статистика:** 496 исполнено | 100% | 4мин. | **Цена:** 240 099,00 RUB | **Доступно:** 0,56487333 ETH | **Лимиты:** 10 000,00 ~ 135 625,52 RUB | **Методы оплаты:** Mobile Top-up, Bank Transfer
* **Мерчант:** Алекс | **Статистика:** 3630 исполнено | 100% | 2мин. | **Цена:** 241 460,45 RUB | **Доступно:** 0,28986864 ETH | **Лимиты:** 2000,00 ~ 69 991,81 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные
* **Мерчант:** xorya | **Статистика:** 366 исполнено | 100% | 6мин. | **Цена:** 240 100,00 RUB | **Доступно:** 1,49670446 ETH | **Лимиты:** 30 000,00 ~ 359 358,74 RUB | **Методы оплаты:** Bank Transfer
* **Мерчант:** Capital | **Статистика:** 138 исполнено | 100% | 2мин. | **Цена:** 240 100,00 RUB | **Доступно:** 0,29883718 ETH | **Лимиты:** 8000,00 ~ 20 000,00 RUB | **Методы оплаты:** Mobile Top-up, Bank Transfer
* **Мерчант:** BADRIK | **Статистика:** 109 исполнено | 99% | 8мин. | **Цена:** 240 231,00 RUB | **Доступно:** 0,99767648 ETH | **Лимиты:** 10 000,00 ~ 239 672,81 RUB | **Методы оплаты:** Mobile Top-up, Bank Transfer
* **Мерчант:** Capital | **Статистика:** 138 исполнено | 100% | 2мин. | **Цена:** 240 360,00 RUB | **Доступно:** 0,24816368 ETH | **Лимиты:** 3000,00 ~ 59 648,62 RUB | **Методы оплаты:** Mobile Top-up, Bank Transfer
* **Мерчант:** Wins! | **Статистика:** 813 исполнено | 98% | 6мин. | **Цена:** 241 429,00 RUB | **Доступно:** 0,69786963 ETH | **Лимиты:** 25 000,00 ~ 168 485,96 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные
* **Мерчант:** Bumblebee Coin | **Статистика:** 125 исполнено | 100% | 5мин. | **Цена:** 241 695,92 RUB | **Доступно:** 0,99609697 ETH | **Лимиты:** 30 000,00 ~ 240 752,57 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** TowerOfPower | **Статистика:** 515 исполнено | 100% | 9мин. | **Цена:** 241 695,92 RUB | **Доступно:** 0,90621338 ETH | **Лимиты:** 21 000,00 ~ 219 028,07 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** Bumblebee Coin | **Статистика:** 125 исполнено | 100% | 5мин. | **Цена:** 242 145,45 RUB | **Доступно:** 0,99609697 ETH | **Лимиты:** 25 000,00 ~ 241 200,34 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** fastchange55 | **Статистика:** 190 исполнено | 100% | 2мин. | **Цена:** 242 900,00 RUB | **Доступно:** 0,02621782 ETH | **Лимиты:** 2000,00 ~ 6368,30 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные
* **Мерчант:** GTA | **Статистика:** 496 исполнено | 100% | 4мин. | **Цена:** 242 999,00 RUB | **Доступно:** 0,68846946 ETH | **Лимиты:** 2000,00 ~ 167 297,39 RUB | **Методы оплаты:** Mobile Top-up, Bank Transfer
* **Мерчант:** Алекс | **Статистика:** 3630 исполнено | 100% | 2мин. | **Цена:** 243 564,24 RUB | **Доступно:** 0,28986864 ETH | **Лимиты:** 1000,00 ~ 70 601,63 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные
* **Мерчант:** Алекс | **Статистика:** 3630 исполнено | 100% | 2мин. | **Цена:** 245 725,74 RUB | **Доступно:** 0,28986864 ETH | **Лимиты:** 501,00 ~ 71 228,18 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные
* **Мерчант:** fine_deal | **Статистика:** 153 исполнено | 100% | 2мин. | **Цена:** 246 046,75 RUB | **Доступно:** 0,45051765 ETH | **Лимиты:** 10 000,00 ~ 110 848,40 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные
* **Мерчант:** Investitor_94 | **Статистика:** 631 исполнено | 99% | 1мин. | **Цена:** 247 240,00 RUB | **Доступно:** 0,04280042 ETH | **Лимиты:** 2000,00 ~ 10 581,97 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** MyagchievM | **Статистика:** 232 исполнено | 99% | 2мин. | **Цена:** 247 300,00 RUB | **Доступно:** 0,02767979 ETH | **Лимиты:** 2000,00 ~ 6845,21 RUB | **Методы оплаты:** Mobile Top-up, Bank Transfer"""

import random

buy_html = ""
lines = raw_text.strip().split('\n')
for line in lines:
    try:
        merchant = re.search(r'\*\*Мерчант:\*\* (.*?)\s*\|', line).group(1).strip()
        stats = re.search(r'\*\*Статистика:\*\* (.*?)\s*\|', line).group(1).strip()
        stats_full = re.search(r'\*\*Статистика:\*\* (.*?) \| \*\*Цена:\*\*', line).group(1).strip()
        price_raw = re.search(r'\*\*Цена:\*\* (.*?) RUB', line).group(1).strip()
        price_float = float(price_raw.replace(' ', '').replace(',', '.'))
        available = re.search(r'\*\*Доступно:\*\* (.*?) ETH', line).group(1).strip()
        limits = re.search(r'\*\*Лимиты:\*\* (.*?) RUB', line).group(1).strip()
        methods_raw = re.search(r'\*\*Методы оплаты:\*\* (.*)', line).group(1).strip()
        methods = [m.strip() for m in methods_raw.split(',')]
        
        pms_html = ""
        for pm in methods:
            if 'Bank Transfer' in pm:
                pms_html += '<span class="bank-pill raif">Bank Transfer</span> '
            elif 'Cash' in pm:
                pms_html += '<span class="bank-pill sber">Cash Deposit to Bank</span> '
            elif 'Mobile' in pm:
                pms_html += '<span class="bank-pill sbp">Mobile Top-up</span> '
            elif 'Наличные' in pm:
                pms_html += '<span class="bank-pill sber">Наличные</span> '
            else:
                pms_html += f'<span class="bank-pill sbp">{pm}</span> '
                
        badge = '<span class="pro-badge">V</span>' if merchant in ['Алекс', 'GuardEx', 'Bumblebee Coin'] else ''
        percent = random.randint(30, 90)
        
        buy_html += f"""
            <div class="p2p-bento-card" data-coin="ETH" style="display: none;">
                <div class="bento-card-top">
                    <div class="bento-avatar" style="background: rgba(255,255,255,0.05);">{merchant[0].upper()}</div>
                    <div class="bento-merchant">
                        <div class="bento-name">{merchant}{badge}</div>
                        <div class="bento-stats">{stats_full}</div>
                    </div>
                </div>
                
                <div class="bento-price-section">
                    <div class="bento-price-label">Курс обмена</div>
                    <div class="bento-price-value">{price_raw} <span>RUB</span></div>
                </div>

                <div class="bento-limits">
                    <div class="limit-bar-bg"><div class="limit-bar-fill" style="width: {percent}%;"></div></div>
                    <div class="limit-text">
                        <span>Доступно: {available} ETH</span>
                        <span>{limits} ₽</span>
                    </div>
                </div>

                <div class="bento-card-bottom">
                    <div class="bento-banks">
                        {pms_html}
                    </div>
                    <button class="bento-buy-btn" onclick="openP2PCalculator('{merchant}', {price_float}, 'ETH', 'RUB', 'sell')">Купить ETH</button>
                </div>
            </div>
"""
    except Exception as e:
        print(f"Error parsing line: {line} -> {e}")

# Re-inject buy_html into grid-buy
parts = html.split('<div class="p2p-bento-grid" id="p2p-ads-grid-buy">')
if len(parts) == 2:
    html = parts[0] + '<div class="p2p-bento-grid" id="p2p-ads-grid-buy">\n' + buy_html + parts[1]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Removed old ETH cards and placed all 26 into buy tab")
