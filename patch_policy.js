const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regexTerms = /if \(type === 'terms'\) \{[\s\S]*?if \(type === 'aml'\)/;
const replacementTerms = `if (type === 'terms') {
                dummyText = \`
                    <p><strong>1. Introduction and Scope</strong><br>
                    Welcome to MAO Exchange (operated by MAO Exchange Ltd., Registration No. 128394-SC, IBC Seychelles). By accessing, downloading, using or clicking on "I agree" to accept any MAO Exchange services, you agree that you have read, understood and accepted all of the terms and conditions stipulated in these Terms of Service. If you do not agree to these Terms, you must immediately suspend your use of our platform.</p>
                    <p><strong>2. General Provisions and Risk Disclosure</strong><br>
                    Trading digital assets involves significant risk and can result in the loss of your invested capital. You should not invest more than you can afford to lose and should ensure that you fully understand the risks involved. MAO Exchange acts solely as a P2P technology provider and smart-contract escrow facilitator. We do not take custody of your fiat funds at any point.</p>
                    <p><strong>3. User Obligations and KYC/AML</strong><br>
                    Users must provide true, accurate, and complete information. MAO Exchange Ltd. reserves the right to freeze accounts, reverse transactions, and cooperate with international law enforcement in cases of suspected money laundering, terrorist financing, or fraud. You acknowledge that our automated AML algorithms may temporarily hold your transactions without prior notice.</p>
                    <p><strong>4. Limitation of Liability</strong><br>
                    To the maximum extent permitted under applicable law, MAO Exchange Ltd., its affiliates, and their respective shareholders, members, directors, officers, employees, attorneys, agents, and representatives shall not be liable for any incidental, indirect, special, punitive, consequential or similar damages or liabilities whatsoever.</p>
                    <p><strong>5. Dispute Resolution</strong><br>
                    Any disputes arising out of or in connection with these Terms shall be referred to and finally resolved by arbitration administered by the Seychelles International Arbitration Centre (SIAC) in accordance with the Arbitration Rules of the SIAC for the time being in force.</p>
                \`;
            } else if (type === 'aml')`;

code = code.replace(regexTerms, replacementTerms);

const regexAml = /if \(type === 'aml'\) \{[\s\S]*?if \(type === 'privacy'\)/;
const replacementAml = `if (type === 'aml') {
                dummyText = \`
                    <p><strong>1. Anti-Money Laundering (AML) Program</strong><br>
                    MAO Exchange Ltd. strictly complies with international AML/CTF (Anti-Money Laundering / Counter-Terrorism Financing) regulations. Our platform employs a proprietary, automated blockchain tracking system (AML: 100% Clean) that scans inbound and outbound digital assets for associations with darknet markets, mixers, and sanctioned entities.</p>
                    <p><strong>2. Know Your Customer (KYC) Procedures</strong><br>
                    While we market a "0% KYC" onboarding experience for basic access, we operate a risk-based approach. We reserve the right to demand full identification (Passport/ID, Proof of Address, Liveness Check) at any time if our risk engine flags a transaction as suspicious. Refusal to comply will result in the immediate and permanent freezing of assets.</p>
                    <p><strong>3. Third-Party Payments</strong><br>
                    Strictly Prohibited. MAO Exchange does not allow fiat transfers from bank accounts that do not match the registered name of the user. Any attempt to use a drop or third-party account will trigger an automatic security freeze, and the funds may be confiscated for compliance review.</p>
                \`;
            } else if (type === 'privacy')`;
            
code = code.replace(regexAml, replacementAml);

const regexPrivacy = /if \(type === 'privacy'\) \{[\s\S]*?\}\s*document\.getElementById\('policy-modal-content'\)/;
const replacementPrivacy = `if (type === 'privacy') {
                dummyText = \`
                    <p><strong>1. Information Collection</strong><br>
                    MAO Exchange Ltd. collects personal data to provide a secure and efficient trading environment. This includes, but is not limited to, IP addresses, device identifiers, wallet addresses, Telegram IDs, and transactional history. This data is collected automatically when you interact with our smart-contracts and web interface.</p>
                    <p><strong>2. Use of Information</strong><br>
                    We use your data to facilitate escrow services, enforce our Terms of Service, prevent fraud, and comply with legal obligations. Your Telegram ID is used strictly for authentication and service notifications via our official bot.</p>
                    <p><strong>3. Data Sharing and Protection</strong><br>
                    We utilize military-grade encryption and secure database architecture. We do not sell your personal data to third-party marketers. However, we will disclose your data to law enforcement agencies upon receipt of a valid court order or subpoena from a competent jurisdiction.</p>
                \`;
            }
            document.getElementById('policy-modal-content')`;

code = code.replace(regexPrivacy, replacementPrivacy);

fs.writeFileSync('index.html', code);
console.log('Legal texts patched');
