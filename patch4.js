const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'public', 'pages', 'admin');
const files = fs.readdirSync(adminDir);

const chatLink = `<li><a href="chat.html"><i class="fas fa-comments"></i> Chat Hỗ Trợ</a></li>\n                <li><a href="../index.html">`;
const chatLinkAlternate = `<li><a href="chat.html"><i class="fa-solid fa-comments"></i> Chat Hỗ Trợ</a></li>\n                <li><a href="../index.html">`;

for (const file of files) {
    if (file.endsWith('.html') && file !== 'chat.html') {
        const filePath = path.join(adminDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (!content.includes('chat.html')) {
            content = content.replace('<li><a href="../index.html">', chatLink);
            fs.writeFileSync(filePath, content);
            console.log('Added chat link to ' + file);
        }
    }
}
