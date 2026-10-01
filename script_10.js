
// UI State Persistence
window.addEventListener('hashchange', handleHashState);
window.addEventListener('load', handleHashState);

function handleHashState() {
    const hash = window.location.hash;
    if (!hash) return;
    
    if (hash === '#reviews') {
        document.getElementById('reviewsModal').classList.add('active');
    } else if (hash.startsWith('#deal-')) {
        const dealId = hash.replace('#deal-', '');
        if (!dealId) return;
        // Fetch deal info
        fetch('/api/p2p/deals/' + dealId, { headers: getAuthHeaders() })
        .then(r => r.json())
        .then(d => {
            if (!d.error) {
                // Check if chat is already open to avoid looping
                if (window.currentDealId != dealId) {
                    openDealChat(d.id, d.maker_name || 'Сделка');
                }
            }
        });
    }
}

// Intercept modal opens to set hash
const originalOpenDealChat = window.openDealChat;
window.openDealChat = function(dealId, makerName) {
    window.location.hash = 'deal-' + dealId;
    if (originalOpenDealChat) originalOpenDealChat(dealId, makerName);
};

const originalCloseDealChat = window.closeDealChat;
window.closeDealChat = function() {
    window.location.hash = 'p2p';
    if (originalCloseDealChat) originalCloseDealChat();
};

const originalOpenReviewsModal = window.openReviewsModal;
window.openReviewsModal = function() {
    window.location.hash = 'reviews';
    if (originalOpenReviewsModal) originalOpenReviewsModal();
    else document.getElementById('reviewsModal').classList.add('active');
};

const originalCloseReviewsModal = window.closeReviewsModal;
window.closeReviewsModal = function() {
    window.location.hash = '';
    if (originalCloseReviewsModal) originalCloseReviewsModal();
    else document.getElementById('reviewsModal').classList.remove('active');
};
