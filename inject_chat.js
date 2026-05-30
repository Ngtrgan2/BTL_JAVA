const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'public', 'pages');
const indexFile = path.join(__dirname, 'public', 'index.html');

const scriptTag = '<script src="../js/chat-widget.js"></script>\n</body>';
const indexScriptTag = '<script src="./js/chat-widget.js"></script>\n</body>';

function inject(file, tag) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('chat-widget.js')) {
        content = content.replace('</body>', tag);
        fs.writeFileSync(file, content);
        console.log('Injected into ' + file);
    }
}

// Inject index.html
if (fs.existsSync(indexFile)) inject(indexFile, indexScriptTag);

// Inject all pages
const files = fs.readdirSync(pagesDir);
for (const file of files) {
    if (file.endsWith('.html') && file !== 'index.html') {
        inject(path.join(pagesDir, file), scriptTag);
    }
}
