const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'public', 'pages', 'admin');
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.html'));

const sidebarLogic = `
            const custNav = document.getElementById('nav-customers');
            if (custNav) {
                if (userInfo.role === 'admin') {
                    custNav.style.display = 'flex';
                    const setNav = document.getElementById('nav-settings');
                    if(setNav) setNav.style.display = 'flex';
                }
            }
`;

for (const file of files) {
    const fPath = path.join(adminDir, file);
    let content = fs.readFileSync(fPath, 'utf8');

    // Break CSS cache
    content = content.replace(/href="\.\.\/\.\.\/css\/admin\.css(\?v=\d+)?"/g, 'href="../../css/admin.css?v=3"');

    // Ensure sidebar logic exists
    if (!content.includes("nav-customers") || (!content.includes("custNav.style.display") && !content.includes("document.getElementById('nav-customers').style.display"))) {
        content = content.replace(/document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{/, "document.addEventListener('DOMContentLoaded', () => {" + sidebarLogic);
    }

    fs.writeFileSync(fPath, content, 'utf8');
}

console.log('Fixed CSS cache and sidebar logic globally.');
