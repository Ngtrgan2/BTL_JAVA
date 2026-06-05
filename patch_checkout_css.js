const fs = require('fs');
const path = require('path');

const checkoutPath = path.join(__dirname, 'public', 'pages', 'checkout.html');
let content = fs.readFileSync(checkoutPath, 'utf8');

// Add display: none to .payment-details
content = content.replace(
    /\.payment-details \{\s*padding: 0 1\.5rem 1\.5rem 3\.5rem;\s*color: var\(--text-secondary\);\s*font-size: 0\.9rem;\s*line-height: 1\.8;\s*\}/,
    `.payment-details {
            padding: 0 1.5rem 1.5rem 3.5rem;
            color: var(--text-secondary);
            font-size: 0.9rem;
            line-height: 1.8;
            display: none;
        }`
);

// Fallback if formatting was slightly different
if (!content.includes('display: none;')) {
    content = content.replace(
        '.payment-details {',
        '.payment-details {\n            display: none;'
    );
}

// Remove inline style display: block from transfer
content = content.replace(
    '<div class="payment-details" style="display: block;">',
    '<div class="payment-details" id="transfer-details">'
);

fs.writeFileSync(checkoutPath, content, 'utf8');
console.log('Fixed checkout.html');
