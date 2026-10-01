with open('server.js', 'r', encoding='utf-8') as f:
    js = f.read()

bad = "SELECT p2p_ads.*, users.username, users.stats FROM p2p_ads JOIN users ON p2p_ads.maker_id = users.id"
good = "SELECT p2p_ads.*, COALESCE(users.display_name, users.telegram_username, users.email) AS username, '99.5% | 12 мин' AS stats FROM p2p_ads JOIN users ON p2p_ads.maker_id = users.id"

if bad in js:
    js = js.replace(bad, good)
else:
    print("Not found public ads query")

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(js)
