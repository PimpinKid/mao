
// Restore active tab
(function() {
    let targetTab = window.location.hash.replace('#', '');
    if (!targetTab || (targetTab !== 'main' && targetTab !== 'p2p')) {
        targetTab = localStorage.getItem('activeTab') || 'main';
    }
    switchTab(targetTab);
})();
