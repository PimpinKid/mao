const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const newEmptyAds = `        if(!data.length) { list.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px; opacity: 0.5;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg><div style="font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 5px;">Нет активных объявлений</div><div style="font-size: 12px;">Создайте объявление, чтобы стать мейкером.</div></div>'; return; }`;

content = content.replace("        if(!data.length) { list.innerHTML = '<div style=\"color:var(--text-muted); text-align:center;\">У вас нет объявлений</div>'; return; }", newEmptyAds);
fs.writeFileSync('index.html', content);
