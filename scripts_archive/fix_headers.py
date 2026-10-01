with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

bad_str = """        headers: getAuthHeaders(),
        // headers: {
            'Content-Type': 'application/json'
        },"""

good_str = """        headers: getAuthHeaders(),"""

html = html.replace(bad_str, good_str)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
