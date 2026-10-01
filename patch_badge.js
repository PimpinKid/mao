const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /let crownHtml = '';[\s\S]*?<div class="bento-stats" style="font-weight: 700; font-size: 11px; letter-spacing: 0\.5px; opacity: 0\.8;">\$\{ad\.tradesCount\} сделок • \$\{ad\.successRate\}%<\/div>/;

const replacement = `let badgeHtml = '';
                    if (ad.topRank === 1) {
                        badgeHtml = \`<div style="margin-left: auto; background: linear-gradient(135deg, #fde047, #f59e0b); color: #78350f; padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 13px; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(245,158,11,0.3);">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 19h20v2H2v-2zm1-2l3-10 4 4.5 2-6.5 2 6.5 4-4.5 3 10H3z"/></svg> 1
                        </div>\`;
                    } else if (ad.topRank === 2) {
                        badgeHtml = \`<div style="margin-left: auto; background: linear-gradient(135deg, #e2e8f0, #94a3b8); color: #0f172a; padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 13px; box-shadow: 0 2px 8px rgba(148,163,184,0.3);">#2</div>\`;
                    } else if (ad.topRank === 3) {
                        badgeHtml = \`<div style="margin-left: auto; background: linear-gradient(135deg, #d97706, #92400e); color: #fff; padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 13px; box-shadow: 0 2px 8px rgba(180,83,9,0.3);">#3</div>\`;
                    }

                    card.innerHTML = \`
                        <div class="bento-card-top">
                            <div class="bento-avatar" style="background: rgba(255,255,255,0.05);">\${initialChar}</div>
                            <div class="bento-merchant">
                                <div class="bento-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px;">\${safeName}\${ad.is_verified_trader ? '<span class="pro-badge">V</span>' : ''}</div>
                                <div class="bento-stats" style="font-weight: 700; font-size: 11px; letter-spacing: 0.5px; opacity: 0.8;">\${ad.tradesCount} сделок • \${ad.successRate}%</div>
                            </div>
                            \${badgeHtml}`;

code = code.replace(regex, replacement);

fs.writeFileSync('index.html', code);
console.log('Badges applied');
