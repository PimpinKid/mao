
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
    