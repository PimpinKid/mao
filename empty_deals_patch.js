const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const newEmptyDeals = `        if (!data || data.length === 0) {
            list.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px; opacity: 0.5;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg><div style="font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 5px;">У вас пока нет активных сделок</div><div style="font-size: 12px;">Откликнитесь на объявление или создайте свое.</div></div>';
            return;
        }`;

content = content.replace("        if (!data || data.length === 0) {\n            list.innerHTML = '<div style=\"color: var(--text-muted); text-align: center; padding: 20px;\">Нет активных сделок</div>';\n            return;\n        }", newEmptyDeals);
fs.writeFileSync('index.html', content);
