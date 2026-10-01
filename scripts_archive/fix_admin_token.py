with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace(", { headers: {'x-admin-token': getAdminToken()} }", "")
html = html.replace("{ headers: {'x-admin-token': getAdminToken()} }", "{}")
html = html.replace(", { headers: {'x-admin-token': getAdminToken(), ...getAuthHeaders()} }", "")
html = html.replace("'x-admin-token': getAdminToken()", "")

# for POST
html = html.replace("headers: {'Content-Type': 'application/json', 'x-admin-token': getAdminToken()}", "headers: {'Content-Type': 'application/json'}")
html = html.replace("headers: {'x-admin-token': getAdminToken()}", "headers: {}")

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)
