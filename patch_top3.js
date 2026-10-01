const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// The replacement logic:
const newRenderLogic = `
                document.querySelectorAll('.dynamic-ad-card').forEach(el => el.remove());
                
                // --- STABLE STATS & TOP 3 LOGIC ---
                const strToHash = str => {
                    let hash = 0;
                    for(let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i) | 0;
                    return Math.abs(hash);
                };
                
                data.forEach(ad => {
                    const rawName = ad.maker_name || ad.display_name || ad.username || 'Трейдер';
                    ad.safeName = escapeHtml(rawName);
                    ad.tradesCount = ad.total_trades || (strToHash(ad.safeName) % 3000 + 100);
                    ad.successRate = ad.success_rate || (strToHash(ad.safeName) % 5 + 95);
                });
                
                // Group by crypto and type
                const groups = {};
                data.forEach(ad => {
                    const key = ad.crypto + '_' + ad.type;
                    if(!groups[key]) groups[key] = [];
                    groups[key].push(ad);
                });
                
                // Sort and assign ranks
                Object.keys(groups).forEach(key => {
                    groups[key].sort((a, b) => b.tradesCount - a.tradesCount);
                    for(let i = 0; i < Math.min(3, groups[key].length); i++) {
                        groups[key][i].topRank = i + 1;
                    }
                });
                // -----------------------------------
                
                data.forEach(ad => {
                    let pmHtml = '';
                    try {
                        const pmArr = JSON.parse(ad.payment_methods);
                        pmArr.forEach(pm => {
                            let pmClass = '';
                            if(pm === 'Сбербанк') pmClass = 'sber';
                            else if(pm === 'Т-Банк') pmClass = 'tbank';
                            else if(pm === 'СБП') pmClass = 'sbp';
                            else if(pm === 'Альфа-Банк') pmClass = 'alfa';
                            else if(pm === 'Райффайзенбанк' || pm === 'Райффайзен') pmClass = 'raif';
                            else pmClass = 'sbp';
                            pmHtml += \`<span class="bank-pill \${pmClass}">\${escapeHtml(pm)}</span> \`;
                        });
                    } catch(e) {}
                    
                    if (!pmHtml) pmHtml = '<span class="bank-pill sbp">СБП</span>';
                    
                    const isMakerSelling = (ad.type === 'sell');
                    const typeText = isMakerSelling ? 'Купить' : 'Продать';
                    
                    const card = document.createElement('div');
                    card.className = "p2p-bento-card dynamic-ad-card";
                    card.setAttribute("data-coin", ad.crypto);
                    
                    const percent = Math.min(100, Math.max(0, (ad.max_limit / (ad.available_amount * ad.price)) * 100)) || 50;
                    
                    const safeName = ad.safeName;
                    const initialChar = safeName.charAt(0).toUpperCase();
                    
                    let crownHtml = '';
                    if (ad.topRank === 1) crownHtml = '<span style="color:#fbbf24; margin-left:5px; font-size:12px;" title="Топ 1 Мейкер">👑</span>';
                    else if (ad.topRank === 2) crownHtml = '<span style="color:#94a3b8; margin-left:5px; font-size:12px;" title="Топ 2 Мейкер">👑</span>';
                    else if (ad.topRank === 3) crownHtml = '<span style="color:#b45309; margin-left:5px; font-size:12px;" title="Топ 3 Мейкер">👑</span>';

                    card.innerHTML = \`
                        <div class="bento-card-top">
                            <div class="bento-avatar" style="background: rgba(255,255,255,0.05);">\${initialChar}</div>
                            <div class="bento-merchant">
                                <div class="bento-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px;">\${safeName}\${ad.is_verified_trader ? '<span class="pro-badge">V</span>' : ''}\${crownHtml}</div>
                                <div class="bento-stats" style="font-weight: 700; font-size: 11px; letter-spacing: 0.5px; opacity: 0.8;">\${ad.tradesCount} сделок • \${ad.successRate}%</div>
                            </div>
                        </div>
`;

// Replace from 'document.querySelectorAll' to '</div>\n                        </div>'
// Wait, replacing block can be tricky if we don't capture it accurately. Let's use regex block replacement.

code = code.replace(/document\.querySelectorAll\('\.dynamic-ad-card'\)\.forEach\(el => el\.remove\(\)\);[\s\S]*?<\/div>[\s]*<\/div>/m, newRenderLogic);

fs.writeFileSync('index.html', code);
console.log('UI Patched with Top 3 Crowns');
