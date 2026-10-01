const puppeteer = require('puppeteer');

(async () => {
    console.log("Starting E2E testing for MAO Exchange...");
    const results = {
        consoleLogs: [],
        errors: [],
        failedRequests: []
    };
    
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: true, 
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        const page = await browser.newPage();
        
        page.on('console', msg => {
            results.consoleLogs.push(msg.text());
        });
        page.on('pageerror', error => {
            results.errors.push(error.message);
        });
        page.on('requestfailed', request => {
            results.failedRequests.push(`${request.url()} - ${request.failure()?.errorText || 'Unknown'}`);
        });

        // Test Main UI
        console.log("Navigating to main page...");
        await page.goto('http://localhost:5050', { waitUntil: 'networkidle2' });
        
        // Wait and find buttons
        const buttons = await page.$$('button');
        console.log(`Found ${buttons.length} buttons on main page.`);
        
        // Let's just click some buttons to see what happens
        for (let i = 0; i < Math.min(buttons.length, 5); i++) {
            try {
                await buttons[i].click();
                await new Promise(r => setTimeout(r, 200));
            } catch (e) {}
        }
        
        // Test Admin Panel
        console.log("Navigating to admin page...");
        await page.goto('http://localhost:5050/admin', { waitUntil: 'networkidle2' });
        
        // Find buttons in admin
        const adminButtons = await page.$$('button');
        console.log(`Found ${adminButtons.length} buttons on admin page.`);
        
        console.log("E2E Tests completed.");
    } catch (e) {
        console.error("Test script failed:", e);
        results.errors.push(e.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    
    console.log("==== TEST REPORT ====");
    console.log("Console logs captured:", results.consoleLogs.length);
    if (results.errors.length > 0) {
        console.log("Errors:");
        results.errors.forEach(err => console.log("-", err));
    } else {
        console.log("No page errors found.");
    }
    
    if (results.failedRequests.length > 0) {
        console.log("Failed requests:");
        results.failedRequests.forEach(req => console.log("-", req));
    } else {
        console.log("No failed requests.");
    }
})();
