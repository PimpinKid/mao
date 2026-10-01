const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
setTimeout(() => {
    const doc = dom.window.document;
    const filterPill = doc.querySelector('.p2p-filter-pill');
    console.log(filterPill.innerHTML);
    const errors = dom.window.__coverage__ || [];
}, 1000);
