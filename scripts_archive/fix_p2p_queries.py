with open('server.js', 'r', encoding='utf-8') as f:
    js = f.read()

bad1 = "SELECT p2p_ads.*, COALESCE(users.display_name, users.telegram_username, users.email) AS username, '99.5% | 12 мин' AS stats FROM p2p_ads"
good1 = "SELECT p2p_ads.*, users.is_verified_trader, COALESCE(users.display_name, users.telegram_username, users.email) AS username, '99.5% | 12 мин' AS stats FROM p2p_ads"

bad2 = "SELECT p2p_ads.*, users.email, users.telegram_id FROM p2p_ads"
good2 = "SELECT p2p_ads.*, users.is_verified_trader, users.email, users.telegram_id FROM p2p_ads"

js = js.replace(bad1, good1).replace(bad2, good2)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(js)
