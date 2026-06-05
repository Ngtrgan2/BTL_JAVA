const fs = require('fs');
const path = require('path');

const checkoutPath = path.join(__dirname, 'public', 'pages', 'checkout.html');
let content = fs.readFileSync(checkoutPath, 'utf8');

content = content.replace(
    '<div class="payment-method active" id="pm-transfer">',
    '<div class="payment-method" id="pm-transfer">'
);

content = content.replace(
    '<input type="radio" name="payment" id="transfer" checked>',
    '<input type="radio" name="payment" id="transfer">'
);

const validationReplacement = `            const isTransfer = document.getElementById('transfer').checked;
            const isCod = document.getElementById('cod').checked;
            if (!isTransfer && !isCod) {
                alert('Vui lòng chọn phương thức thanh toán!');
                return;
            }
            const paymentMethod = isTransfer ? 'transfer' : 'cod';

            // Validate`;

content = content.replace(
    "            const paymentMethod = document.getElementById('transfer').checked ? 'transfer' : 'cod';\n\n            // Validate",
    validationReplacement
);

// Fallback replacement if line endings differ
content = content.replace(
    "            const paymentMethod = document.getElementById('transfer').checked ? 'transfer' : 'cod';\r\n\r\n            // Validate",
    validationReplacement
);

fs.writeFileSync(checkoutPath, content, 'utf8');
console.log('Fixed checkout.html');
