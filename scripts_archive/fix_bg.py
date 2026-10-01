import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# I will replace the body CSS to just color.
old_body = """        body {
            background-color: #080504;
            background-image: 
                radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), rgba(0,0,0,0)),
                radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 130px 80px, rgba(229, 142, 56, 0.5), rgba(0,0,0,0)),
                radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,0.6), rgba(0,0,0,0));
            background-repeat: repeat;
            background-size: 250px 250px;
            background-attachment: fixed;
            color: var(--text-main);
            overflow-x: hidden;
            position: relative;
        }"""

new_body = """        body {
            background-color: #080504;
            color: var(--text-main);
            overflow-x: hidden;
            position: relative;
        }
        body::after {
            content: '';
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background-image: 
                radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), rgba(0,0,0,0)),
                radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 130px 80px, rgba(229, 142, 56, 0.5), rgba(0,0,0,0)),
                radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,0.6), rgba(0,0,0,0));
            background-repeat: repeat;
            background-size: 250px 250px;
            z-index: -2;
            pointer-events: none;
        }"""

if old_body in html:
    html = html.replace(old_body, new_body)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Background fixed.")
else:
    print("Old body not found.")
