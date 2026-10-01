const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const contactsBlock = `            <div>
                <h4 style="color: #fff; margin-bottom: 15px; font-size: 15px;">Контакты поддержки</h4>
                <div style="display: flex; gap: 10px;">
                    <a href="https://t.me/mao_support_bot" target="_blank" style="flex: 1; text-align: center; background: rgba(41, 169, 234, 0.1); color: #29a9ea; border: 1px solid rgba(41, 169, 234, 0.3); padding: 12px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; display: flex; justify-content: center; align-items: center; gap: 8px; transition: 0.2s;" onmouseover="this.style.background='rgba(41, 169, 234, 0.2)'" onmouseout="this.style.background='rgba(41, 169, 234, 0.1)'">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-18.6 7.227e-1a2.25 2.25 0 0 0 .126 4.195l4.8 1.536 2.062 6.324a1.5 1.5 0 0 0 2.7.4l2.846-3.805 4.542 3.393a2.25 2.25 0 0 0 3.59-1.39l3.23-15.6a2.25 2.25 0 0 0-2.316-2.735z"></path></svg>
                        Telegram Bot
                    </a>
                    <a href="mailto:support@mao-exchange.com" style="flex: 1; text-align: center; background: rgba(255,255,255, 0.05); color: #fff; border: 1px solid rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; display: flex; justify-content: center; align-items: center; gap: 8px; transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255, 0.1)'" onmouseout="this.style.background='rgba(255,255,255, 0.05)'">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        Email
                    </a>
                </div>
            </div>`;

content = content.replace(contactsBlock, '');
content = content.replace('Help Center / Поддержка', 'Частые вопросы (FAQ)');
content = content.replace('<h4 style="color: #fff; margin-bottom: 15px; font-size: 15px;">Частые вопросы (FAQ)</h4>', '');

// Add FAQ button inside floating chat window
const chatHeader = `<div class="chat-header">
            <h3 data-i18n="chat-title">Арбитраж MAO Exchange</h3>
            <span style="cursor:pointer;" onclick="toggleChat(false)">✕</span>
        </div>`;
const newChatHeader = `<div class="chat-header" style="flex-direction: column; align-items: stretch; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 data-i18n="chat-title" style="margin:0;">Служба поддержки</h3>
                <span style="cursor:pointer;" onclick="toggleChat(false)">✕</span>
            </div>
            <button onclick="openHelpCenterModal()" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 8px; padding: 8px; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                Частые вопросы (FAQ)
            </button>
        </div>`;
content = content.replace(chatHeader, newChatHeader);

fs.writeFileSync('index.html', content);
