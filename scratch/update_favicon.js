const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Calculate relative path to images/kimcuong.png
    let relativePath = path.relative(path.dirname(filePath), path.join(publicDir, 'images', 'kimcuong.png'));
    relativePath = relativePath.replace(/\\/g, '/'); // normalize slashes for HTML

    const faviconTag = `<link rel="icon" type="image/png" href="${relativePath}">`;
    
    // Check if there is already a favicon link
    const existingIconRegex = /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*>/i;
    
    if (existingIconRegex.test(content)) {
        // Replace existing
        content = content.replace(existingIconRegex, faviconTag);
    } else {
        // Inject right before </head>
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

// Ensure the image exists
const imgPath = path.join(publicDir, 'images', 'kimcuong.png');
if (!fs.existsSync(imgPath)) {
    console.error(`Error: File not found at ${imgPath}`);
    process.exit(1);
}

walkDir(publicDir);
console.log('Successfully updated all HTML files to use the new diamond favicon!');
