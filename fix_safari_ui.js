const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// 1. Remove background arrows from select and enforce absolute no-appearance
content = content.replace(
    /background-image: url\("data:image\/svg\+xml;charset=UTF-8.*?!important;/g,
    'background-image: none !important;'
);
content = content.replace(
    /padding-right: 40px !important;/g,
    'padding-right: 15px !important;'
);

// Add strict webkit overrides for select
const strictSelectCSS = `
        select {
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
            background-image: none !important;
            padding-right: 15px !important;
        }
        select::-ms-expand {
            display: none !important;
        }
`;
content = content.replace('/* Custom Selects (Remove Native Arrow) */', '/* Custom Selects (Remove Native Arrow) */\n' + strictSelectCSS);


// 2. Fix pagination position
const oldPaginationLogic = `        // Find both grids and append after them (or their parent wrapper)
        const buyGrid = document.getElementById('p2p-ads-grid-buy');
        buyGrid.parentNode.insertBefore(container, buyGrid.nextSibling);`;

const newPaginationLogic = `        // Append to the wrapper that contains both grids
        const wrapper = document.getElementById('p2p-ads-grid-buy').parentNode;
        wrapper.appendChild(container);`;

content = content.replace(oldPaginationLogic, newPaginationLogic);

fs.writeFileSync('index.html', content);
