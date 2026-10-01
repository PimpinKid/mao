window.addEventListener('hashchange', handleHash);
window.addEventListener('load', handleHash);

function handleHash() {
    const hash = window.location.hash;
    if (!hash) return;
    
    if (hash === '#reviews') {
        openReviewsModal();
    } else if (hash.startsWith('#deal-')) {
        const dealId = hash.replace('#deal-', '');
        if (!dealId) return;
        // Fetch deal details to open it properly
        fetch('/api/p2p/deals/' + dealId, { headers: getAuthHeaders() })
        .then(r => r.json())
        .then(d => {
            if (!d.error) {
                // Call openDealChat without makerName if not strictly needed, or pass from deal
                openDealChat(d.id, d.maker_name || 'Сделка');
            }
        });
    } else if (hash === '#p2p') {
        switchTab('p2p');
    } else if (hash === '#exchange') {
        switchTab('exchange');
    }
}

// Ensure modals update hash
const originalOpenDealChat = openDealChat;
openDealChat = function(dealId, makerName) {
    window.location.hash = 'deal-' + dealId;
    originalOpenDealChat(dealId, makerName);
};

const originalCloseDealChat = closeDealChat;
closeDealChat = function() {
    window.location.hash = 'p2p';
    originalCloseDealChat();
};

const originalOpenReviewsModal = window.openReviewsModal || function(){ document.getElementById('reviewsModal').classList.add('active'); };
window.openReviewsModal = function() {
    window.location.hash = 'reviews';
    document.getElementById('reviewsModal').classList.add('active');
};

const originalCloseReviewsModal = window.closeReviewsModal || function(){ document.getElementById('reviewsModal').classList.remove('active'); };
window.closeReviewsModal = function() {
    window.location.hash = '';
    document.getElementById('reviewsModal').classList.remove('active');
};
