const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const html = fs.readFileSync('admin.html', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost:5050/admin" });
setTimeout(() => {
    console.log("adminLoginModal classes:", dom.window.document.getElementById('adminLoginModal').className);
    console.log("Body classes:", dom.window.document.body.className);
    console.log("Error? ", dom.window.errors || "None");
}, 2000);
