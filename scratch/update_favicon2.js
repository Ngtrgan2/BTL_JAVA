const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const imgName = 'kimcuong2.png';

function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    let relativePath = path.relative(path.dirname(filePath), path.join(publicDir, 'images', imgName));
    relativePath = relativePath.replace(/\\/g, '/');

    const faviconTag = `<link rel="icon" type="image/png" href="${relativePath}">`;
    const existingIconRegex = /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*>/i;
    
    if (existingIconRegex.test(content)) {
        content = content.replace(existingIconRegex, faviconTag);
    } else {
        content = content.replace('</head>', `    ${faviconTag}\n</head>`);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated favicon in: ${filePath}`);
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            processHtmlFile(fullPath);
        }
    }
}

walkDir(publicDir);
console.log('Done replacing with kimcuong2.png');
