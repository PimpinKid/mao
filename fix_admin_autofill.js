const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const autofillCSS = `
        /* Override Chrome Autofill Styles */
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
            -webkit-box-shadow: 0 0 0 1000px #111827 inset !important; /* Tailwind bg-gray-900 */
            -webkit-text-fill-color: #ffffff !important;
            transition: background-color 5000s ease-in-out 0s;
            caret-color: white;
        }
`;

content = content.replace(
    '</style>',
    autofillCSS + '\n    </style>'
);

fs.writeFileSync('admin.html', content);
