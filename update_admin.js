const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// 1. Add Sidebar Link
const sidebarLink = `
                <a href="#balances" class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition" onclick="switchTab('balances')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Балансы (RUB)
                </a>`;

content = content.replace(
    /<a href="#requisites" class="flex items-center/g,
    sidebarLink + '\n                <a href="#requisites" class="flex items-center'
);

// 2. Add Content Container
const contentContainer = `
            <!-- Вкладка Балансы -->
            <div id="tab-balances" class="hidden">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Балансы пользователей (RUB)</h2>
                    <button onclick="loadBalances()" class="bg-primary/20 text-primary hover:bg-primary hover:text-black px-4 py-2 rounded-lg font-bold transition">Обновить данные</button>
                </div>
                <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="bg-gray-900 border-b border-gray-700">
                                <tr>
                                    <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Пользователь</th>
                                    <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Баланс (RUB)</th>
                                    <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Действия</th>
                                </tr>
                            </thead>
                            <tbody id="balancesTable" class="divide-y divide-gray-700">
                                <!-- JS Populated -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;

content = content.replace(
    '<!-- Вкладка Реквизиты P2P -->',
    contentContainer + '\n\n            <!-- Вкладка Реквизиты P2P -->'
);

// 3. Add JS to fetch and render
const jsLogic = `
        async function loadBalances() {
            try {
                const res = await fetch('/api/admin/balances', { headers: { 'x-admin-token': getCookie('admin_session') } });
                const users = await res.json();
                const tbody = document.getElementById('balancesTable');
                tbody.innerHTML = '';
                users.forEach(u => {
                    const tr = document.createElement('tr');
                    tr.className = 'hover:bg-gray-750 transition';
                    tr.innerHTML = \`
                        <td class="px-6 py-4 font-mono font-bold text-gray-400">#\${u.id}</td>
                        <td class="px-6 py-4">
                            <div class="font-bold text-white">\${escapeHTML(u.display_name || 'Без имени')}</div>
                            <div class="text-xs text-gray-500">\${escapeHTML(u.email || 'Email не указан')}</div>
                        </td>
                        <td class="px-6 py-4">
                            <input type="number" step="0.01" id="bal-input-\${u.id}" value="\${parseFloat(u.balance_rub || 0).toFixed(2)}" class="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white font-mono w-32 focus:border-primary focus:outline-none"> RUB
                        </td>
                        <td class="px-6 py-4">
                            <button onclick="updateBalance(\${u.id})" class="bg-green-600/20 text-green-500 hover:bg-green-600 hover:text-white px-4 py-2 rounded font-bold text-sm transition">Сохранить</button>
                        </td>
                    \`;
                    tbody.appendChild(tr);
                });
            } catch (err) {
                console.error(err);
            }
        }

        async function updateBalance(userId) {
            const input = document.getElementById('bal-input-' + userId);
            const newBal = input.value;
            try {
                const res = await fetch('/api/admin/balances/' + userId, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-admin-token': getCookie('admin_session') },
                    body: JSON.stringify({ balance_rub: newBal })
                });
                if (res.ok) alert('Баланс успешно обновлен!');
                else alert('Ошибка при сохранении');
            } catch(e) {
                alert(e.message);
            }
        }
`;

content = content.replace(
    'async function loadUsers() {',
    jsLogic + '\n        async function loadUsers() {'
);

// Include loadBalances() in switchTab
content = content.replace(
    "if (tabId === 'requisites') loadRequisites();",
    "if (tabId === 'requisites') loadRequisites();\n            if (tabId === 'balances') loadBalances();"
);

fs.writeFileSync('admin.html', content);
