const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, 'public', 'pages');
const indexFile = path.join(htmlDir, 'index.html');

const indexContent = fs.readFileSync(indexFile, 'utf8');

// Match <footer class="footer"> ... </footer>
const footerMatch = indexContent.match(/(<footer class="footer">[\s\S]*?<\/footer>)/);
if (!footerMatch) {
    console.error("Footer not found in index.html");
    process.exit(1);
}

const goodFooter = footerMatch[1];
const files = fs.readdirSync(htmlDir);

for (const file of files) {
    if (file.endsWith('.html') && file !== 'index.html') {
        const filePath = path.join(htmlDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Replace existing footer or <footer class="footer"> block
        // some files might just have <footer>
        const newContent = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/g, goodFooter);
        
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Synced footer in ${file}`);
        } else {
            console.log(`No footer found to replace in ${file}`);
        }
    }
}
