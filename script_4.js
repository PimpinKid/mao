
                    function validateWalletInput() {
                        const val = document.getElementById('user-wallet').value.trim();
                        const detected = document.getElementById('wallet-detected');
                        const detectedText = document.getElementById('wallet-detected-text');
                        if (!val) {
                            detected.style.display = 'none';
                            return;
                        }
                        
                        let type = '';
                        if (val.match(/^T[A-Za-z1-9]{33}$/)) type = 'Сеть: TRC20 (Tron)';
                        else if (val.match(/^0x[a-fA-F0-9]{40}$/)) type = 'Сеть: ERC20/BEP20';
                        else if (val.match(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/) || val.match(/^bc1[a-zA-HJ-NP-Z0-9]{39,59}$/)) type = 'Сеть: Bitcoin';
                        else if (val.replace(/\s/g, '').match(/^\d{16,19}$/)) type = 'Банковская карта';
                        
                        if (type) {
                            detectedText.textContent = type;
                            detected.style.display = 'flex';
                        } else {
                            detected.style.display = 'none';
                        }
                    }
                    
                    
                    // The timer logic is now managed globally by window.resetRateTimer()

                