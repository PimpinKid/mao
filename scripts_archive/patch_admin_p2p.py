import re

with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

bad_block = """            tr.innerHTML = `
                <td class="px-6 py-4 font-bold text-white text-sm">
                    ID: #${ad.id}
                </td>
                <td class="px-6 py-4 text-gray-300 text-sm">
                    <div class="font-bold text-white mb-1">${ad.type === 'buy' ? 'Покупка (BUY)' : 'Продажа (SELL)'}</div>
                    <span class="text-xs text-gray-400">${ad.crypto} за ${ad.fiat} | ${ad.price} | Лимит: ${ad.min_limit}-${ad.max_limit}</span>
                </td>
                <td class="px-6 py-4 text-gray-300 text-sm">
                    ${ad.email || ad.telegram_id || 'Неизвестно'}
                </td>
                <td class="px-6 py-4">
                    ${statusHtml}
                </td>
                <td class="px-6 py-4 text-right">
                    ${!isApproved ? `<button onclick="moderateAd(${ad.id}, 'approved')" class="bg-green/20 text-green hover:bg-green hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition mr-2">Одобрить</button>` : ''}
                    ${ad.status !== 'rejected' ? `<button onclick="moderateAd(${ad.id}, 'rejected')" class="bg-red/20 text-red hover:bg-red hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition">Отклонить</button>` : ''}
                </td>
            `;"""

good_block = """            const verifiedBadge = ad.is_verified_trader ? '<span class="ml-2 text-[10px] bg-orange-500 text-black px-1.5 py-0.5 rounded font-bold">V</span>' : '';
            const verifiedBtn = ad.is_verified_trader 
                ? `<button onclick="toggleVerifiedMaker(${ad.maker_id})" class="bg-red/20 text-red hover:bg-red hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition ml-2">Забрать 'V'</button>`
                : `<button onclick="toggleVerifiedMaker(${ad.maker_id})" class="bg-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-black px-3 py-1.5 rounded-md text-xs font-bold transition ml-2">Выдать 'V'</button>`;
            
            tr.innerHTML = `
                <td class="px-6 py-4 font-bold text-white text-sm">
                    ID: #${ad.id}<br>
                    <span class="text-xs text-gray-400">Maker ID: ${ad.maker_id}</span>${verifiedBadge}
                </td>
                <td class="px-6 py-4 text-gray-300 text-sm">
                    <div class="font-bold text-white mb-1">${ad.type === 'buy' ? 'Покупка (BUY)' : 'Продажа (SELL)'}</div>
                    <span class="text-xs text-gray-400">${ad.crypto} за ${ad.fiat} | ${ad.price} | Лимит: ${ad.min_limit}-${ad.max_limit}</span>
                </td>
                <td class="px-6 py-4 text-gray-300 text-sm">
                    ${ad.email || ad.telegram_id || 'Неизвестно'}
                </td>
                <td class="px-6 py-4">
                    ${statusHtml}
                </td>
                <td class="px-6 py-4 text-right">
                    ${!isApproved ? `<button onclick="moderateAd(${ad.id}, 'approved')" class="bg-green/20 text-green hover:bg-green hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition mr-2">Одобрить</button>` : ''}
                    ${ad.status !== 'rejected' ? `<button onclick="moderateAd(${ad.id}, 'rejected')" class="bg-red/20 text-red hover:bg-red hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition">Отклонить</button>` : ''}
                    ${verifiedBtn}
                </td>
            `;"""

if bad_block in html:
    html = html.replace(bad_block, good_block)
    with open('admin.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Patched successfully.")
else:
    print("Block not found!")
