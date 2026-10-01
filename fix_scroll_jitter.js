const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const oldScrollJs = `    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (!header) return;
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });`;

const newScrollJs = `    let headerScrolledState = false;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (!header) return;
        if (window.scrollY > 60 && !headerScrolledState) {
            header.classList.add('scrolled');
            headerScrolledState = true;
        } else if (window.scrollY < 15 && headerScrolledState) {
            header.classList.remove('scrolled');
            headerScrolledState = false;
        }
    });`;

content = content.replace(oldScrollJs, newScrollJs);

fs.writeFileSync('index.html', content);
