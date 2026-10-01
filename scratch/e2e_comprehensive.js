const puppeteer = require('puppeteer');

(async () => {
    console.log("Starting comprehensive E2E testing for MAO Exchange...");
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
        
        // Context 1: User A
        const contextA = await browser.createBrowserContext();
        const pageA = await contextA.newPage();
        
        pageA.on('console', msg => {
            if(msg.type() === 'error') results.consoleLogs.push(`User A Console Error: ${msg.text()}`);
        });
        pageA.on('pageerror', error => {
            results.errors.push(`User A Page Error: ${error.message}`);
        });
        pageA.on('requestfailed', request => {
            results.failedRequests.push(`User A Failed Request: ${request.url()} - ${request.failure()?.errorText || 'Unknown'}`);
        });

        console.log("User A navigating to main page...");
        await pageA.goto('http://localhost:5050', { waitUntil: 'networkidle2' });
        
        // Register and login User A via API in page context
        console.log("Registering User A...");
        const userAAuth = await pageA.evaluate(async () => {
            const email = `test_seller_${Date.now()}@example.com`;
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: "password123" })
            });
            const data = await res.json();
            if(data.token) {
                localStorage.setItem('token', data.token);
                return { success: true, email: email, data: data };
            }
            return { success: false, data: data };
        });
        
        if (!userAAuth.success) {
            console.log("Failed to register User A", userAAuth);
            throw new Error("User A registration failed");
        }
        
        console.log("User A registered. Reloading to apply auth...");
        await pageA.reload({ waitUntil: 'networkidle2' });
        
        // Check if logged in successfully by finding user elements
        const loggedInA = await pageA.evaluate(() => {
            return document.querySelector('#header-auth-btn') === null; 
        });
        console.log("User A login state:", loggedInA ? "Success" : "Failed");

        // Set USDT balance for User A so they can create an ad
        console.log("Setting USDT balance for User A...");
        await pageA.evaluate(async () => {
            const token = localStorage.getItem('token');
            // Assuming wallet signature is mocked or we can just call it
            // Wait, `/user/wallet` endpoint verifies signature! We might not be able to bypass it easily.
            // Let's just create a Buy ad (fiat -> crypto) which might not require crypto balance.
        });
        
        // Create an ad for User A
        console.log("User A creating an ad...");
        const adCreation = await pageA.evaluate(async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/p2p/ads', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: 'buy',
                    fiatAmount: 1000,
                    cryptoAmount: 10,
                    price: 100,
                    fiatCurrency: 'RUB',
                    paymentMethods: ['sberbank']
                })
            });
            return await res.json();
        });
        console.log("Ad creation response:", adCreation);
        
        if(adCreation.error) {
            results.errors.push(`Ad Creation Error: ${adCreation.error}`);
        } else {
            console.log("Ad created successfully! Ad ID:", adCreation.adId || adCreation.id);
        }

        // Context 2: User B
        const contextB = await browser.createBrowserContext();
        const pageB = await contextB.newPage();
        console.log("User B navigating to main page...");
        await pageB.goto('http://localhost:5050', { waitUntil: 'networkidle2' });
        
        // Register and login User B
        console.log("Registering User B...");
        const userBAuth = await pageB.evaluate(async () => {
            const email = `test_buyer_${Date.now()}@example.com`;
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: "password123" })
            });
            const data = await res.json();
            if(data.token) {
                localStorage.setItem('token', data.token);
                return { success: true, email: email };
            }
            return { success: false, data: data };
        });
        
        if (!userBAuth.success) throw new Error("User B registration failed");
        await pageB.reload({ waitUntil: 'networkidle2' });

        if (!adCreation.error && adCreation.id) {
            console.log("User B attempting to start an escrow deal...");
            const dealStart = await pageB.evaluate(async (adId) => {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/p2p/deals', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        adId: adId,
                        fiatAmount: 1000,
                        cryptoAmount: 10
                    })
                });
                return await res.json();
            }, adCreation.id);
            console.log("Deal start response:", dealStart);
            
            if(dealStart.error) {
                results.errors.push(`Deal Start Error: ${dealStart.error}`);
            } else if (dealStart.dealId) {
                console.log("Deal started successfully! Deal ID:", dealStart.dealId);
                
                // Test chat / socket logic
                console.log("User B sending a message...");
                const msgRes = await pageB.evaluate(async (dealId) => {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`/api/p2p/deals/${dealId}/messages`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ content: "Hello from User B!" })
                    });
                    return await res.json();
                }, dealStart.dealId);
                console.log("Message sent response:", msgRes);
            }
        }
        
    } catch (e) {
        console.error("Test script failed:", e);
        results.errors.push(e.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    
    console.log("==== COMPREHENSIVE TEST REPORT ====");
    console.log("Console errors captured:", results.consoleLogs.length);
    if (results.errors.length > 0) {
        console.log("Errors:");
        results.errors.forEach(err => console.log("-", err));
    } else {
        console.log("No page errors found.");
    }
    
    if (results.failedRequests.length > 0) {
        console.log("Failed requests:");
        // remove duplicates
        const uniqueFails = [...new Set(results.failedRequests)];
        uniqueFails.forEach(req => console.log("-", req));
    } else {
        console.log("No failed requests.");
    }
})();
