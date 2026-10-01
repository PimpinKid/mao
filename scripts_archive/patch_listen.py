import re

with open('server.js', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("server.listen(PORT, () => {", "server.listen(PORT, '0.0.0.0', () => {")
# let's update the console.log to print the 0.0.0.0 or the user's IP as well
code = code.replace("http://localhost:${PORT}", "http://192.168.100.112:${PORT}")

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(code)
print("server.js patched")
