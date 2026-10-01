const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle0' });
    
    const web3ModalExists = await page.evaluate(() => typeof window.web3Modal !== 'undefined');
    console.log('web3Modal exists:', web3ModalExists);
    
    await browser.close();
})();
