const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const oldToggleFaq = `    function toggleFaq(btn) {
        if (!btn) return;
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('.icon');
        if (!content) return;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            if (icon) icon.textContent = '+';
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            if (icon) icon.textContent = '−';
        }
    }`;

const newToggleFaq = `    function toggleFaq(btn) {
        if (!btn) return;
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('.icon');
        if (!content) return;
        
        // Check if it's currently expanded (has a pixel value)
        if (content.style.maxHeight && content.style.maxHeight !== '0px' && content.style.maxHeight !== '0') {
            content.style.maxHeight = '0px';
            if (icon) icon.textContent = '+';
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            if (icon) icon.textContent = '−';
        }
    }`;

content = content.replace(oldToggleFaq, newToggleFaq);

// Also need to ensure the HTML elements have maxHeight="0px" instead of "0" just in case, though the logic handles "0".
// Let's do a quick pass on the HTML to ensure they use '0px'
content = content.replace(/max-height: 0;/g, 'max-height: 0px;');

fs.writeFileSync('index.html', content);
