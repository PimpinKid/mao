const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const loaderCss = `
        /* GLOBAL LOADER */
        #global-loader {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: 9999999;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            background: rgba(18, 20, 26, 0.75);
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            opacity: 1; visibility: visible;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        .saturn-container {
            position: relative; width: 120px; height: 120px;
            display: flex; justify-content: center; align-items: center;
            margin-bottom: 25px;
        }
        .saturn-planet {
            position: absolute; width: 50px; height: 50px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, var(--accent-orange), #8c4a17);
            box-shadow: 0 0 25px rgba(229, 142, 56, 0.5);
            animation: planetPulse 2s ease-in-out infinite alternate;
        }
        .saturn-ring {
            position: absolute; width: 120px; height: 120px;
            border-radius: 50%;
            border: 4px solid transparent;
            border-top: 5px solid rgba(255, 255, 255, 0.9);
            border-bottom: 5px solid rgba(255, 255, 255, 0.9);
            animation: ringSpin 3.5s linear infinite;
        }
        .loader-text {
            color: #fff; font-size: 15px; font-weight: 600; letter-spacing: 3px;
            text-transform: uppercase;
            animation: textPulse 1.5s ease-in-out infinite alternate;
        }
        @keyframes planetPulse {
            0% { transform: scale(0.95); box-shadow: 0 0 15px rgba(229, 142, 56, 0.3); }
            100% { transform: scale(1.05); box-shadow: 0 0 40px rgba(229, 142, 56, 0.7); }
        }
        @keyframes ringSpin {
            0% { transform: rotateX(75deg) rotateY(15deg) rotateZ(0deg); }
            100% { transform: rotateX(75deg) rotateY(15deg) rotateZ(360deg); }
        }
        @keyframes textPulse {
            0% { opacity: 0.4; }
            100% { opacity: 1; }
        }
`;

content = content.replace('</style>', loaderCss + '\n</style>');
fs.writeFileSync('index.html', content);
