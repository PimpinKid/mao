const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const customAlertsHTML = `
    <!-- Custom MAO Alert/Confirm Modals -->
    <div id="mao-alert-overlay" class="fixed inset-0 z-[10005] bg-black/80 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-200" style="backdrop-filter: blur(5px);">
        <div class="bg-gray-900 border border-primary rounded-xl shadow-[0_0_40px_rgba(229,142,56,0.15)] p-6 max-w-sm w-full text-center transform scale-95 transition-transform duration-200" id="mao-alert-box">
            <div class="text-primary flex justify-center mb-4">
                <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <div id="mao-alert-msg" class="text-white text-sm font-semibold mb-6 leading-relaxed break-words"></div>
            <button id="mao-alert-btn" class="w-full bg-primary text-black font-black py-3 rounded-lg hover:bg-primary/90 transition shadow-[0_4px_15px_rgba(229,142,56,0.15)]" onclick="closeMaoAlert()">ПОНЯТНО</button>
        </div>
    </div>

    <div id="mao-confirm-overlay" class="fixed inset-0 z-[10005] bg-black/80 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-200" style="backdrop-filter: blur(5px);">
        <div class="bg-gray-900 border border-primary rounded-xl shadow-[0_0_40px_rgba(229,142,56,0.15)] p-6 max-w-sm w-full text-center transform scale-95 transition-transform duration-200" id="mao-confirm-box">
            <div class="text-primary flex justify-center mb-4">
                <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <div id="mao-confirm-msg" class="text-white text-sm font-semibold mb-6 leading-relaxed break-words"></div>
            <div class="flex gap-3 justify-center">
                <button id="mao-confirm-cancel" class="flex-1 bg-transparent border border-gray-700 text-gray-400 font-bold py-3 rounded-lg hover:bg-gray-800 transition">ОТМЕНА</button>
                <button id="mao-confirm-ok" class="flex-1 bg-primary text-black font-black py-3 rounded-lg hover:bg-primary/90 transition shadow-[0_4px_15px_rgba(229,142,56,0.15)]">ПОДТВЕРДИТЬ</button>
            </div>
        </div>
    </div>
    
    <script>
        function closeMaoAlert() {
            const overlay = document.getElementById('mao-alert-overlay');
            const box = document.getElementById('mao-alert-box');
            overlay.classList.remove('opacity-100', 'pointer-events-auto');
            box.classList.remove('scale-100');
        }

        // Override native alert globally
        window.alert = function(msg) {
            document.getElementById('mao-alert-msg').innerText = msg;
            const overlay = document.getElementById('mao-alert-overlay');
            const box = document.getElementById('mao-alert-box');
            overlay.classList.add('opacity-100', 'pointer-events-auto');
            box.classList.add('scale-100');
        };

        // Async confirm replacement
        window.maoConfirm = function(msg) {
            return new Promise((resolve) => {
                document.getElementById('mao-confirm-msg').innerText = msg;
                const overlay = document.getElementById('mao-confirm-overlay');
                const box = document.getElementById('mao-confirm-box');
                
                overlay.classList.add('opacity-100', 'pointer-events-auto');
                box.classList.add('scale-100');
                
                document.getElementById('mao-confirm-ok').onclick = function() {
                    overlay.classList.remove('opacity-100', 'pointer-events-auto');
                    box.classList.remove('scale-100');
                    resolve(true);
                };
                document.getElementById('mao-confirm-cancel').onclick = function() {
                    overlay.classList.remove('opacity-100', 'pointer-events-auto');
                    box.classList.remove('scale-100');
                    resolve(false);
                };
            });
        };
    </script>
`;

content = content.replace('</body>', customAlertsHTML + '\n</body>');

const oldConfirm = `if (!confirm('Вы уверены, что хотите обновить шаг эскроу на: ' + step + '?')) return;`;
const newConfirm = `if (!(await window.maoConfirm('Вы уверены, что хотите обновить шаг эскроу на: ' + step + '?'))) return;`;
content = content.replace(oldConfirm, newConfirm);

fs.writeFileSync('admin.html', content);
