const jsdom = require("jsdom");
const fs = require("fs");
const { JSDOM } = jsdom;

const html = fs.readFileSync('admin.html', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.sendTo(console);
virtualConsole.on("jsdomError", (error) => {
  console.error("JSDOM Error:", error);
});

const dom = new JSDOM(html, { 
    runScripts: "dangerously", 
    virtualConsole,
    url: "http://localhost/admin"
});

setTimeout(() => {
    try {
        dom.window.switchTab('p2pdeals');
        console.log("Switched tab successfully");
        const nav = dom.window.document.getElementById('nav-p2pdeals');
        if(nav && nav.classList.contains('active')) {
            console.log("Nav button became active");
        } else {
            console.log("Nav button NOT active");
        }
    } catch(e) {
        console.error("switchTab failed:", e);
    }
}, 500);
