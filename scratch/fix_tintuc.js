const fs = require('fs');
const path = require('path');

const tintucPath = path.join(__dirname, '..', 'public', 'pages', 'tintuc.html');
let html = fs.readFileSync(tintucPath, 'utf8');

// The issue is `\`` and `\${` in the script. I will just replace them.
html = html.replace(/\\`/g, '`');
html = html.replace(/\\\${/g, '${');

fs.writeFileSync(tintucPath, html);
console.log('Fixed escaping in tintuc.html');
