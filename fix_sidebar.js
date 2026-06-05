const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'public', 'pages', 'admin');
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.html'));

for (const file of files) {
    const fullPath = path.join(adminDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;

    // Pattern 1: custNav.style.display = 'flex'
    if (content.includes("custNav.style.display = 'flex'") && !content.includes("document.getElementById('nav-settings').style.display = 'flex'")) {
        content = content.replace(
            "custNav.style.display = 'flex';",
            "custNav.style.display = 'flex';\n                const setNav = document.getElementById('nav-settings');\n                if(setNav) setNav.style.display = 'flex';"
        );
        changed = true;
    }

    // Pattern 2: document.getElementById('nav-customers').style.display = 'flex'
    if (content.includes("document.getElementById('nav-customers').style.display = 'flex';") && !content.includes("document.getElementById('nav-settings').style.display = 'flex'")) {
        content = content.replace(
            "document.getElementById('nav-customers').style.display = 'flex';",
            "document.getElementById('nav-customers').style.display = 'flex';\n                const setNav = document.getElementById('nav-settings');\n                if(setNav) setNav.style.display = 'flex';"
        );
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed sidebar logic in ' + file);
    }
}
