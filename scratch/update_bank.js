const fs = require('fs');
const path = require('path');

const checkoutPath = path.join(__dirname, '..', 'public', 'pages', 'checkout.html');
let html = fs.readFileSync(checkoutPath, 'utf8');

// Update HTML text
html = html.replace(/Ngân hàng Kỹ Thương Việt Nam \(Techcombank\)/g, 'Ngân hàng MB Bank');
html = html.replace(/Số TK: <strong>4310122005<\/strong>/g, 'Số TK: <strong>68268888668886</strong>');
html = html.replace(/Chủ TK: <strong>NGUYEN TRUONG AN<\/strong>/g, 'Chủ TK: <strong>NGUYEN TAN DUNG</strong>');

// Update JS for VietQR
const oldUrl = /https:\/\/img\.vietqr\.io\/image\/970407-4310122005-compact\.jpg\?amount=\$\{amount\}&accountName=NGUYEN%20TRUONG%20AN&addInfo=\$\{addInfo\}/g;
const newUrl = 'https://img.vietqr.io/image/MB-68268888668886-compact2.png?amount=${amount}&accountName=NGUYEN%20TAN%20DUNG&addInfo=${addInfo}';
html = html.replace(oldUrl, newUrl);

fs.writeFileSync(checkoutPath, html);
console.log('Successfully updated bank info in checkout.html');
