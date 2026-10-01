const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const footerHtml = `
    <!-- FOOTER START -->
    <footer style="margin-top: 60px; border-top: 1px solid var(--card-border); background: var(--bg-main); padding: 40px 20px 20px 20px;">
        <div style="max-width: 1300px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px;">
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 30px;">
                <div style="flex: 1; min-width: 250px;">
                    <div style="font-size: 24px; font-weight: 800; font-style: italic; color: #fff; margin-bottom: 15px;">MAO<span style="color: var(--accent-orange);">.</span></div>
                    <p style="color: var(--text-muted); font-size: 13px; line-height: 1.6;">
                        Платформа децентрализованного обмена и P2P-торговли. Мы предоставляем безопасную инфраструктуру с эскроу-сервисом для защиты обеих сторон сделки.
                    </p>
                </div>
                <div style="flex: 1; min-width: 200px; display: flex; gap: 50px;">
                    <div>
                        <h4 style="color: #fff; font-size: 14px; margin-bottom: 15px;">Документы</h4>
                        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
                            <li><a href="#" style="color: var(--text-muted); text-decoration: none; font-size: 13px; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-muted)'">Terms of Service</a></li>
                            <li><a href="#" style="color: var(--text-muted); text-decoration: none; font-size: 13px; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-muted)'">Privacy Policy</a></li>
                            <li><a href="#" style="color: var(--text-muted); text-decoration: none; font-size: 13px; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-muted)'">AML/KYC Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style="color: #fff; font-size: 14px; margin-bottom: 15px;">Платформа</h4>
                        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
                            <li><a href="#" style="color: var(--text-muted); text-decoration: none; font-size: 13px; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-muted)'">Сетка комиссий (Fee Schedule)</a></li>
                            <li><a href="#" onclick="openHelpCenterModal(); return false;" style="color: var(--text-muted); text-decoration: none; font-size: 13px; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-muted)'">FAQ & Поддержка</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; font-size: 11px; color: rgba(255,255,255,0.3); line-height: 1.5;">
                <strong style="color: rgba(255,255,255,0.5);">Risk Disclaimer:</strong> Торговля цифровыми активами сопряжена с высоким уровнем риска и может подходить не всем инвесторам. Стоимость криптовалют подвержена сильным колебаниям. MAO Exchange не несет ответственности за любые убытки, возникшие в результате использования платформы. Пожалуйста, убедитесь, что вы полностью понимаете риски.
                <br><br>
                © 2026 MAO Exchange. All rights reserved.
            </div>
        </div>
    </footer>
    <!-- FOOTER END -->

    <!-- Help Center Modal -->
    <div class="modal-overlay" id="helpCenterModal" onclick="if(event.target===this) document.getElementById('helpCenterModal').classList.remove('active')">
        <div class="modal-box" style="max-width: 600px; padding: 30px; border-radius: 20px;">
            <span class="modal-close" style="position: absolute; top: 20px; right: 20px; cursor: pointer; color: var(--text-muted); font-size: 20px;" onclick="document.getElementById('helpCenterModal').classList.remove('active')">✕</span>
            <div class="modal-title" style="margin-bottom: 25px; display: flex; align-items: center; gap: 10px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-orange);"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                Help Center / Поддержка
            </div>
            
            <div style="margin-bottom: 30px;">
                <h4 style="color: #fff; margin-bottom: 15px; font-size: 15px;">Частые вопросы (FAQ)</h4>
                
                <div style="border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden;">
                    <!-- FAQ Item 1 -->
                    <div style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <button style="width: 100%; text-align: left; background: rgba(255,255,255,0.02); color: #fff; border: none; padding: 15px 20px; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
                            Как работает Escrow-гарант? <span style="color: var(--accent-orange);">▼</span>
                        </button>
                        <div style="padding: 15px 20px; font-size: 13px; color: var(--text-muted); line-height: 1.5; display: none; background: rgba(0,0,0,0.2);">
                            При открытии сделки, криптовалюта мейкера временно блокируется на специальном смарт-контракте (или внутреннем счете). Она переводится тейкеру только после того, как обе стороны подтвердят успешный фиатный перевод.
                        </div>
                    </div>
                    
                    <!-- FAQ Item 2 -->
                    <div style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <button style="width: 100%; text-align: left; background: rgba(255,255,255,0.02); color: #fff; border: none; padding: 15px 20px; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
                            Что делать, если контрагент не перевел деньги? <span style="color: var(--accent-orange);">▼</span>
                        </button>
                        <div style="padding: 15px 20px; font-size: 13px; color: var(--text-muted); line-height: 1.5; display: none; background: rgba(0,0,0,0.2);">
                            Если оплата не поступила, не нажимайте кнопку "Отпустить монеты". Дождитесь истечения таймера сделки или нажмите кнопку "Открыть диспут" (Апелляция). К чату подключится администратор.
                        </div>
                    </div>
                    
                    <!-- FAQ Item 3 -->
                    <div>
                        <button style="width: 100%; text-align: left; background: rgba(255,255,255,0.02); color: #fff; border: none; padding: 15px 20px; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
                            Какие комиссии берет платформа? <span style="color: var(--accent-orange);">▼</span>
                        </button>
                        <div style="padding: 15px 20px; font-size: 13px; color: var(--text-muted); line-height: 1.5; display: none; background: rgba(0,0,0,0.2);">
                            Мы не берем комиссию за P2P-сделки (0%). Мейкеры и тейкеры торгуют абсолютно бесплатно. Единственная комиссия — сетевой сбор блокчейна при выводе средств.
                        </div>
                    </div>
                </div>
            </div>
            
            <div>
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
            </div>
        </div>
    </div>
    
    <script>
        function openHelpCenterModal() {
            document.getElementById('helpCenterModal').classList.add('active');
        }
    </script>
`;

content = content.replace('</body>', footerHtml + '\n</body>');
fs.writeFileSync('index.html', content);
