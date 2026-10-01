const bcrypt = require('bcrypt');
async function check() {
    const hash = "$2b$10$Q8jsfzNitQxAnFCteQcmj.FmjMkyVc/b9HQe8yE8s8aSBothT4uye";
    const pwds = ['123456', '12345678', 'password', 'admin', 'admin123', 'admin1234', 'qwerty'];
    for (let p of pwds) {
        if (await bcrypt.compare(p, hash)) {
            console.log("Found:", p);
            return;
        }
    }
    console.log("Not found in common list");
}
check();
