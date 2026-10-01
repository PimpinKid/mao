with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_media = False
media_lines = []
new_lines = []

for i, line in enumerate(lines):
    if '@media (max-width: 768px)' in line and '.p2p-bento-grid { grid-template-columns: 1fr; gap: 15px; }' in lines[i+1]:
        in_media = True
        media_lines.append(line)
    elif in_media:
        media_lines.append(line)
        if '}' in line and 'white-space: normal;' in lines[i-1]:
            in_media = False
    else:
        new_lines.append(line)

media_block = "".join(media_lines)
html = "".join(new_lines)
if media_block:
    html = html.replace('</style>', media_block + '\n    </style>')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Successfully moved block")
else:
    print("Block not found")
