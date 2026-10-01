const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const originalFooterEnd = `<div class="partners-bar" style="margin-top: 0; justify-content: center; width: 100%;">
                <span>BestChange</span>
                <span>РБК</span>
                <span>ExchangeSumo</span>
                <span>Bits.media</span>
            </div>`;

const newRiskDisclaimer = `
            <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; margin-top: 10px; font-size: 11px; color: rgba(255,255,255,0.3); line-height: 1.5; text-align: center; max-width: 800px;">
                <strong style="color: rgba(255,255,255,0.5);">Risk Disclaimer:</strong> Торговля цифровыми активами сопряжена с высоким уровнем риска и может подходить не всем инвесторам. Стоимость криптовалют подвержена сильным колебаниям. MAO Exchange не несет ответственности за любые убытки, возникшие в результате использования платформы. Пожалуйста, убедитесь, что вы полностью понимаете риски.
            </div>`;

content = content.replace(originalFooterEnd, originalFooterEnd + newRiskDisclaimer);
fs.writeFileSync('index.html', content);
