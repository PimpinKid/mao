
        function openPolicyModal(type) {
            const titles = {
                'terms': 'Terms of Service',
                'aml': 'AML Policy',
                'privacy': 'Privacy Policy'
            };
            document.getElementById('policy-modal-title').innerText = titles[type] || 'Policy';
            const overlay = document.getElementById('policy-modal-overlay');
            overlay.classList.add('active');
            
            const dummyText = `
                <p><strong>1. Introduction</strong><br>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.</p>
                <p><strong>2. User Obligations</strong><br>
                Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa.</p>
                <p><strong>3. Liability</strong><br>
                Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.</p>
                <p><strong>4. Amendments</strong><br>
                Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem.</p>
            `;
            document.getElementById('policy-modal-body').innerHTML = dummyText;
        }

        function closePolicyModal() {
            document.getElementById('policy-modal-overlay').classList.remove('active');
        }
    