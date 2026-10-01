const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const loaderHtml = `
    <!-- GLOBAL LOADER -->
    <div id="global-loader">
        <div class="saturn-container">
            <div class="saturn-ring"></div>
            <div class="saturn-planet"></div>
        </div>
        <div class="loader-text">Синхронизация пространства...</div>
    </div>
    <script>
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loader = document.getElementById('global-loader');
                if (loader) {
                    loader.style.opacity = '0';
                    loader.style.visibility = 'hidden';
                }
            }, 600); // Small delay to let animations sync
        });
        window.addEventListener('beforeunload', () => {
            const loader = document.getElementById('global-loader');
            if (loader) {
                loader.style.opacity = '1';
                loader.style.visibility = 'visible';
            }
        });
    </script>
`;

content = content.replace('<div class="aurora-bg"></div>', '<div class="aurora-bg"></div>\n' + loaderHtml);
fs.writeFileSync('index.html', content);
