const fs = require('fs');
const path = require('path');

const htmlDir = __dirname;
const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

for (const file of files) {
    if (file === 'admin') continue; // directory
    
    const filePath = path.join(htmlDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    let modified = false;
    
    if (!content.includes('toast.js')) {
        // inject toast.js before theme.js or </body>
        if (content.includes('<script src="../js/theme.js"></script>')) {
            content = content.replace('<script src="../js/theme.js"></script>', '<script src="../js/toast.js"></script>\n<script src="../js/theme.js"></script>');
        } else {
            content = content.replace('</body>', '<script src="../js/toast.js"></script>\n</body>');
        }
        modified = true;
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Injected toast.js into ${file}`);
    }
}
console.log('Done.');
