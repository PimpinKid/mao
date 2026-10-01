const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Find the broken line
const brokenLineRegex = /icon: 'data:image\/svg\+xml;utf8,<svg xmlns='http:\/\/www\.w3\.org\/2000\/svg'[\s\S]*?<\/svg>'/;
const match = code.match(brokenLineRegex);

if (match) {
    // Replace the single quotes inside the SVG with %22 (URL encoded double quotes)
    // Wait, replacing ALL single quotes between data:image... and </svg>
    let fixedString = match[0].replace(/'/g, "%22");
    // But we need the outer quotes to remain single quotes!
    fixedString = "icon: '" + fixedString.substring(9, fixedString.length - 3) + "'";
    // wait, match[0] starts with `icon: 'data...`
    // Let's just do it simpler:
    let innerSvg = match[0].substring(7, match[0].length - 1); // removes `icon: '` and `'`
    innerSvg = innerSvg.replace(/'/g, "%22");
    let finalReplacement = "icon: '" + innerSvg + "'";
    
    code = code.replace(brokenLineRegex, finalReplacement);
    fs.writeFileSync('index.html', code);
    console.log('Syntax error fixed in USDT icon in currenciesData');
} else {
    console.log('Could not find the broken line in currenciesData');
}

// Now we ALSO need to check if I broke the <img> tag!
// `<img src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=024" class="f-coin usdt">`
// My replace was: code = code.replace(/https:\/\/cryptologos\.cc\/logos\/tether-usdt-logo\.svg\?v=024/g, sbpBeautifulSvg);
// If it was `<img src="url">`, it became `<img src="data:image/svg+xml;utf8,<svg xmlns='http...'>"`
// Here the outer is double quotes, so inner single quotes are actually FINE!
// BUT if there were double quotes inside sbpBeautifulSvg, it would break.
// However, sbpBeautifulSvg used only single quotes! So `<img src="data... '...' ">` is valid HTML.
