import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pattern = r'body\s*\{.*?(background-image:[^;]+;)\s*(background-repeat:[^;]+;)\s*(background-size:[^;]+;)\s*(background-attachment:\s*fixed;).*?\}'
match = re.search(pattern, html, re.DOTALL)

if match:
    # Remove the background properties from body
    new_html = html.replace(match.group(1), "")
    new_html = new_html.replace(match.group(2), "")
    new_html = new_html.replace(match.group(3), "")
    new_html = new_html.replace(match.group(4), "")
    
    # Insert body::after rule right after body block
    after_block = """
        body::after {
            content: '';
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            %s
            %s
            %s
            z-index: -2;
            pointer-events: none;
        }
""" % (match.group(1).strip(), match.group(2).strip(), match.group(3).strip())
    
    # find where body block ends
    body_end_idx = new_html.find('}', new_html.find('body {')) + 1
    new_html = new_html[:body_end_idx] + after_block + new_html[body_end_idx:]
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Body background fixed using regex.")
else:
    print("Regex didn't match.")
