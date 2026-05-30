const fs = require('fs');
let content = fs.readFileSync('public/pages/index.html', 'utf8');
if (!content.includes('chat-widget.js')) {
    content = content.replace('</body>', '<script src="../js/chat-widget.js"></script>\n</body>');
    fs.writeFileSync('public/pages/index.html', content);
    console.log('Injected chat-widget into index.html');
} else {
    console.log('Already injected');
}
