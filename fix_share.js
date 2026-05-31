const fs = require('fs');
let c = fs.readFileSync('public/pages/product-detail.html', 'utf8');
c = c.replace(/if\(window\.Cart\)\s*Cart\.showToast\([^)]+\);/g, "alert('Copy link thành công!'); if(window.Cart) Cart.showToast('Copy link thành công!');");
fs.writeFileSync('public/pages/product-detail.html', c);
