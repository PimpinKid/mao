const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const newCSS = `
        /* ========= FORM ELEMENTS RESET (BRUTALIST THEME) ========= */
        /* Remove Number Input Arrows */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input[type="number"] {
            -moz-appearance: textfield;
        }

        /* Custom Checkboxes */
        input[type="checkbox"] {
            appearance: none;
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(229, 142, 56, 0.3);
            border-radius: 4px;
            display: grid;
            place-content: center;
            cursor: pointer;
            transition: 0.2s ease;
            position: relative;
            margin: 0;
        }
        input[type="checkbox"]::before {
            content: "";
            width: 10px;
            height: 10px;
            transform: scale(0);
            transition: 120ms transform ease-in-out;
            box-shadow: inset 1em 1em var(--accent-orange);
            background-color: var(--accent-orange);
            transform-origin: center;
            clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
        }
        input[type="checkbox"]:checked::before {
            transform: scale(1);
        }
        input[type="checkbox"]:checked {
            border-color: var(--accent-orange);
            background: rgba(229, 142, 56, 0.1);
        }

        /* Custom Selects (Remove Native Arrow) */
        select {
            appearance: none;
            -webkit-appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e58e38' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
            background-repeat: no-repeat !important;
            background-position: right 15px center !important;
            background-size: 16px !important;
            padding-right: 40px !important;
        }
        select::-ms-expand {
            display: none;
        }
        /* ========================================================== */
`;

content = content.replace(
    '/* Override Chrome Autofill Styles for Dark Theme */',
    newCSS + '\n        /* Override Chrome Autofill Styles for Dark Theme */'
);

fs.writeFileSync('index.html', content);
