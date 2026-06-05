const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'public', 'pages', 'admin');
const dashboardPath = path.join(adminDir, 'dashboard.html');
const dashHtml = fs.readFileSync(dashboardPath, 'utf8');

const menuRegex = /<div class="sidebar-menu">[\s\S]*?<\/div>/;
const idealMenuMatch = dashHtml.match(menuRegex);

if (!idealMenuMatch) {
    console.error("Could not find ideal sidebar menu in dashboard.html");
    process.exit(1);
}

const idealMenu = idealMenuMatch[0];
console.log("Found ideal menu block.");

const htmlFiles = fs.readdirSync(adminDir).filter(f => f.endsWith('.html') && f !== 'dashboard.html');

for (const file of htmlFiles) {
    const fPath = path.join(adminDir, file);
    let content = fs.readFileSync(fPath, 'utf8');
    
    if (menuRegex.test(content)) {
        content = content.replace(menuRegex, idealMenu);
        fs.writeFileSync(fPath, content, 'utf8');
        console.log(`Replaced sidebar in ${file}`);
    } else {
        console.log(`No sidebar found in ${file}`);
    }
}
