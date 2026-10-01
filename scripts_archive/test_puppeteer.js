const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    await page.goto('file:///Users/a./Desktop/back%20end%20work/index.html', { waitUntil: 'networkidle0' });
    
    // Check if web3Modal is defined
    const web3Modal = await page.evaluate(() => typeof window.web3Modal);
    console.log('web3Modal type:', web3Modal);
    
    await browser.close();
})();
