import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We need to replace the entire `@media (max-width: 768px)` block at the END of the CSS.
# I will use a precise regex to find it, or string manipulation.

start_marker = "        @media (max-width: 768px) {"
end_marker = "    </style>"

if start_marker in html and end_marker in html:
    # Find the LAST occurrence of start_marker (which is the one we injected)
    start_idx = html.rfind(start_marker)
    end_idx = html.find(end_marker, start_idx)
    
    if start_idx != -1 and end_idx != -1:
        # Build the new compact CSS
        new_mobile_css = """        @media (max-width: 768px) {
            header { flex-direction: column; gap: 15px; padding: 15px 0; }
            .header-center-nav { width: 100%; justify-content: center; gap: 15px; padding: 10px; overflow-x: auto; }
            .header-right { width: 100%; justify-content: space-between; }
            
            .p2p-bento-header { flex-direction: column; align-items: flex-start; gap: 15px; margin-bottom: 20px; }
            .p2p-hero-title { font-size: 32px; }
            .p2p-hero-subtitle { font-size: 13px; line-height: 1.4; }
            .btn-create-ad { width: 100%; justify-content: center; }
            
            .p2p-filter-pill { padding: 12px; gap: 10px; }
            .filter-group { min-width: 100%; }
            
            /* COMPACT BYBIT-STYLE P2P CARDS */
            .p2p-bento-grid { grid-template-columns: 1fr; gap: 0; }
            .p2p-bento-card { 
                padding: 20px 0; 
                border: none; border-bottom: 1px solid rgba(255,255,255,0.05); 
                border-radius: 0; background: transparent; box-shadow: none; 
                gap: 8px; 
            }
            .p2p-bento-card:hover { transform: none; box-shadow: none; border-color: rgba(255,255,255,0.05); }

            /* Top Row */
            .bento-card-top { gap: 8px; align-items: center; }
            .bento-avatar { width: 22px; height: 22px; font-size: 11px; border-radius: 50%; }
            .bento-merchant { display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; }
            .bento-name { font-size: 15px; }
            .bento-stats { font-size: 12px; color: var(--text-muted); text-align: right; }
            .pro-badge { font-size: 9px; padding: 1px 3px; margin-left: 4px; }
            
            /* Price */
            .bento-price-section { padding: 6px 0; border: none; }
            .bento-price-label { display: none; }
            .bento-price-value { font-size: 24px; font-weight: 700; color: #fff; line-height: 1; }
            .bento-price-value span { font-size: 14px; font-weight: 600; }

            /* Limits & Available */
            .limit-bar-bg { display: none; }
            .limit-text { flex-direction: column-reverse; gap: 4px; font-size: 12px; color: var(--text-muted); font-weight: 500; }
            .limit-text span { opacity: 0.8; }
            
            /* Bottom Row (Banks + Button) */
            .bento-card-bottom { flex-direction: row; align-items: flex-end; justify-content: space-between; gap: 10px; padding-top: 6px; }
            .bento-banks { flex-direction: column; gap: 6px; max-width: calc(100% - 90px); }
            
            /* Transform bank pills into Bybit-style vertical line indicators */
            .bank-pill { 
                background: transparent !important; 
                padding: 0 0 0 8px; 
                border-left: 2px solid; 
                border-radius: 0; 
                font-size: 12px; 
                color: var(--text-muted) !important;
                font-weight: 500;
                line-height: 1.2;
            }
            .bank-pill.tbank { border-color: var(--yellow); }
            .bank-pill.sber { border-color: var(--green); }
            .bank-pill.raif { border-color: #ffe600; }
            .bank-pill.sbp { border-color: #fff; }
            .bank-pill.alfa { border-color: #ef3124; }
            
            .bento-buy-btn, .bento-sell-btn {
                position: relative;
                bottom: auto; right: auto;
                width: auto;
                padding: 8px 24px;
                font-size: 14px;
                border-radius: 8px;
                margin: 0;
            }
            
            /* Other Layout Fixes */
            .hero-section .hero-title { font-size: 32px; }
            .hero-section .hero-subtitle { font-size: 14px; }
            .exchange-card { padding: 16px; }
            .input-group input { font-size: 24px; }
            .modal-box { padding: 20px !important; margin: 15px; width: calc(100% - 30px); }
            .modal-title { font-size: 20px !important; }
            .modal-subtitle { font-size: 12px !important; margin-bottom: 15px !important; }
            .advantages-grid { grid-template-columns: 1fr; gap: 12px; }
            .bottom-grid-three { gap: 12px; }
            .chat-window { width: calc(100% - 30px); right: 15px; left: 15px; bottom: 80px; height: 400px; }
        }
"""
        
        # Replace the chunk
        html = html[:start_idx] + new_mobile_css + html[end_idx:]
        
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Compact mobile layout applied successfully.")
    else:
        print("Markers not found correctly.")
else:
    print("Start or end marker missing.")

