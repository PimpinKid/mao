import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

ru_arr = "['только что', 'пару секунд назад', '15 секунд назад', '30 секунд назад', '1 мин назад', '2 мин назад', '3 мин назад', '5 мин назад', '8 мин назад', '10 мин назад', '12 мин назад', '15 мин назад']"
en_arr = "['just now', 'a few seconds ago', '15 seconds ago', '30 seconds ago', '1 min ago', '2 min ago', '3 min ago', '5 min ago', '8 min ago', '10 min ago', '12 min ago', '15 min ago']"

html = re.sub(r"const timingMapRu = \[.*?\];", f"const timingMapRu = {ru_arr};", html)
html = re.sub(r"const timingMapEn = \[.*?\];", f"const timingMapEn = {en_arr};", html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
