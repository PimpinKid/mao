
        // Override native alert globally
        window.alert = function(msg) {
            document.getElementById('mao-alert-msg').innerText = msg;
            document.getElementById('mao-alert-overlay').classList.add('active');
        };

        // Async confirm replacement
        window.maoConfirm = function(msg) {
            return new Promise((resolve) => {
                document.getElementById('mao-confirm-msg').innerText = msg;
                const overlay = document.getElementById('mao-confirm-overlay');
                overlay.classList.add('active');
                
                document.getElementById('mao-confirm-ok').onclick = function() {
                    overlay.classList.remove('active');
                    resolve(true);
                };
                document.getElementById('mao-confirm-cancel').onclick = function() {
                    overlay.classList.remove('active');
                    resolve(false);
                };
            });
        };
    