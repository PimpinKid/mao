const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Patch P2P upload logic
code = code.replace(/const formData = new FormData\(\);[\s\S]*?\}\s*catch\(e\) \{\s*showToast\('Ошибка сети', 'error'\);\s*\}/, `
        if (file.size > 2 * 1024 * 1024) {
            showToast('Файл слишком большой (макс 2MB)', 'error');
            fileInput.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64 = e.target.result;
            const imgMarkdown = \`[IMAGE]\${base64}\`;
            
            if (typeof socket !== 'undefined' && socket && socket.connected) {
                socket.emit('deal:chat_send', { deal_id: currentDealId, message: imgMarkdown });
            }
            
            const chatBox = document.getElementById('p2p-chat-history');
            const senderLabel = currentUser ? (currentUser.display_name || 'Вы') : 'Вы';
            chatBox.innerHTML += \`
                <div class="msg user">
                    <div style="font-size:10px; opacity:0.75; margin-bottom:3px; font-weight:700;">\${escapeHtml(senderLabel)}</div>
                    <div><img src="\${base64}" style="max-width:100%; border-radius:8px; margin-top:5px; max-height:150px;" /></div>
                </div>\`;
            chatBox.scrollTop = chatBox.scrollHeight;
            fileInput.value = '';
        };
        reader.readAsDataURL(file);
`);

// Patch Support upload logic to not fail if API fails, just send over socket directly
code = code.replace(/try \{\s*const res = await fetch\('\/api\/support\/upload'[\s\S]*?\}\s*catch\(err\) \{\s*showToast\(currentLang === 'en' \? 'Upload error' : 'Ошибка загрузки изображения', 'error'\);\s*\}/, `
            try {
                const imgMarkdown = \`[IMAGE]\${base64}\`;
                if (typeof socket !== 'undefined' && socket && socket.connected) {
                    socket.emit('user:chat_send', { message: imgMarkdown });
                } else {
                    await fetch('/api/support/messages', { credentials: 'same-origin',
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                        body: JSON.stringify({ message: imgMarkdown })
                    });
                }
                
                const msgs = document.getElementById('chatMessages');
                const senderLabel = currentUser ? (currentUser.display_name || 'Вы') : 'Вы';
                msgs.innerHTML += \`
                    <div class="msg user">
                        <div style="font-size:10px; opacity:0.75; margin-bottom:3px; font-weight:700;">\${escapeHtml(senderLabel)}</div>
                        <div><img src="\${base64}" style="max-width:100%; border-radius:8px; margin-top:5px; max-height:150px;" /></div>
                    </div>\`;
                msgs.scrollTop = msgs.scrollHeight;
                
            } catch(err) {
                console.error(err);
            }
`);

fs.writeFileSync('index.html', code);
console.log('Upload logic patched');
