const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const autofillCSS = `
        /* Override Chrome Autofill Styles for Dark Theme */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        select:-webkit-autofill,
        select:-webkit-autofill:hover,
        select:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0 1000px #1a1512 inset !important;
            -webkit-text-fill-color: #ffffff !important;
            transition: background-color 5000s ease-in-out 0s;
            caret-color: white;
        }
`;

content = content.replace(
    '/* UI UX PRO MAX - Component Styles */',
    autofillCSS + '\n        /* UI UX PRO MAX - Component Styles */'
);

fs.writeFileSync('index.html', content);
