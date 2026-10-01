import re
import random

raw_text = """* **Мерчант:** TowerOfPower | **Статистика:** 515 исполнено | 100% | 1мин. | **Цена:** 256 894,74 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 5000,00 ~ 2 000 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** Laguzers | **Статистика:** 220 исполнено | 100% | 1мин. | **Цена:** 256 894,74 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 15 000,00 ~ 200 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** XO Bravo | **Статистика:** 432 исполнено | 100% | 1мин. | **Цена:** 256 894,74 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 15 000,00 ~ 2 000 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** TowerOfPower | **Статистика:** 515 исполнено | 100% | 1мин. | **Цена:** 256 894,74 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 5000,00 ~ 2 000 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** Lacerta fast | **Статистика:** 1007 исполнено | 100% | 1мин. | **Цена:** 256 894,74 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 5000,00 ~ 2 000 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** Bumblebee Coin | **Статистика:** 125 исполнено | 100% | **Цена:** 256 894,74 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 5000,00 ~ 2 000 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up
* **Мерчант:** X-Order | **Статистика:** 354 исполнено | 99% | 1мин. | **Цена:** 256 894,74 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 15 000,00 ~ 200 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** XO Foxtrot | **Статистика:** 72 исполнено | 100% | 1мин. | **Цена:** 256 894,74 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 20 000,00 ~ 2 000 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** Quebec | **Статистика:** 135 исполнено | 100% | **Цена:** 256 894,74 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 20 000,00 ~ 2 000 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** Ignition | **Статистика:** 86 исполнено | 100% | **Цена:** 256 894,74 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 20 000,00 ~ 2 000 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** 30SECONDS | **Статистика:** 163 исполнено | 99% | 1мин. | **Цена:** 256 894,74 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 20 000,00 ~ 2 000 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** XO Delta | **Статистика:** 99 исполнено | 99% | 7мин. | **Цена:** 256 894,74 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 20 000,00 ~ 2 000 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** code1n3 | **Статистика:** 672 исполнено | 100% | 1мин. | **Цена:** 256 725,75 RUB | **Доступно:** 29,92062426 ETH | **Лимиты:** 10 000,00 ~ 3 500 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные
* **Мерчант:** Toni_Kroos | **Статистика:** 202 исполнено | 100% | 1мин. | **Цена:** 256 725,75 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 15 000,00 ~ 3 500 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные
* **Мерчант:** Cryptanus_ | **Статистика:** 1087 исполнено | 100% | 1мин. | **Цена:** 256 725,75 RUB | **Доступно:** 29,88261642 ETH | **Лимиты:** 5000,00 ~ 3 500 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** Flaska | **Статистика:** 1722 исполнено | 100% | 3мин. | **Цена:** 256 725,75 RUB | **Доступно:** 29,19900000 ETH | **Лимиты:** 20 000,00 ~ 1 000 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные
* **Мерчант:** slacker | **Статистика:** 172 исполнено | 100% | 3мин. | **Цена:** 256 725,75 RUB | **Доступно:** 29,96526986 ETH | **Лимиты:** 3500,00 ~ 3 500 000,00 RUB | **Методы оплаты:** Mobile Top-up, Наличные, Bank Transfer
* **Мерчант:** thecrypto_king | **Статистика:** 329 исполнено | 100% | 5мин. | **Цена:** 256 725,75 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 20 000,00 ~ 2 000 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** Mstitell | **Статистика:** 161 исполнено | 100% | 2мин. | **Цена:** 256 725,75 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 5000,00 ~ 3 500 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** Nohchi77 | **Статистика:** 219 исполнено | 100% | **Цена:** 256 725,75 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 5000,00 ~ 3 500 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные
* **Мерчант:** WickeD | **Статистика:** 1451 исполнено | 100% | 9мин. | **Цена:** 256 725,75 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 30 000,00 ~ 3 500 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** xorya | **Статистика:** 366 исполнено | 100% | 1мин. | **Цена:** 256 742,28 RUB | **Доступно:** 27,82376523 ETH | **Лимиты:** 20 000,00 ~ 3 500 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** Lacerta fast | **Статистика:** 1007 исполнено | 100% | 1мин. | **Цена:** 256 742,28 RUB | **Доступно:** 29,87785517 ETH | **Лимиты:** 20 000,00 ~ 2 000 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** Bumblebee Coin | **Статистика:** 125 исполнено | 100% | **Цена:** 256 742,28 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 25 000,00 ~ 2 000 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** TowerOfPower | **Статистика:** 515 исполнено | 100% | 1мин. | **Цена:** 256 742,28 RUB | **Доступно:** 29,79999997 ETH | **Лимиты:** 25 000,00 ~ 2 000 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Bank Transfer
* **Мерчант:** CREATORX | **Статистика:** 898 исполнено | 100% | 1мин. | **Цена:** 256 742,28 RUB | **Доступно:** 29,81491087 ETH | **Лимиты:** 3000,00 ~ 3 500 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные
* **Мерчант:** Valdosi | **Статистика:** 129 исполнено | 100% | 1мин. | **Цена:** 256 742,28 RUB | **Доступно:** 30,00000000 ETH | **Лимиты:** 10 000,00 ~ 3 500 000,00 RUB | **Методы оплаты:** Cash Deposit to Bank, Mobile Top-up, Наличные"""

import random

sell_html = ""
lines = raw_text.strip().split('\n')
for line in lines:
    try:
        merchant = re.search(r'\*\*Мерчант:\*\* (.*?)\s*\|', line).group(1).strip()
        stats = re.search(r'\*\*Статистика:\*\* (.*?)\s*\|', line).group(1).strip()
        
        # Some lines don't have the time component (e.g. 1мин.), they look like:
        # **Статистика:** 125 исполнено | 100% | **Цена:**
        stats_match = re.search(r'\*\*Статистика:\*\* (.*?) \| \*\*Цена:\*\*', line)
        if stats_match:
            stats_full = stats_match.group(1).strip()
        else:
            stats_full = stats

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
                
        badge = '<span class="pro-badge">V</span>' if merchant in ['TowerOfPower', 'Bumblebee Coin', 'WickeD'] else ''
        percent = random.randint(30, 90)
        
        sell_html += f"""
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
                    <button class="bento-sell-btn" onclick="openP2PCalculator('{merchant}', {price_float}, 'ETH', 'RUB', 'buy')">Продать ETH</button>
                </div>
            </div>
"""
    except Exception as e:
        print(f"Error parsing line: {line} -> {e}")

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

parts = html.split('<div class="p2p-bento-grid" id="p2p-ads-grid-sell" style="display: none;">')
if len(parts) == 2:
    html = parts[0] + '<div class="p2p-bento-grid" id="p2p-ads-grid-sell" style="display: none;">\n' + sell_html + parts[1]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Added all 27 ETH cards into sell tab")
else:
    print("Could not find p2p-ads-grid-sell")
