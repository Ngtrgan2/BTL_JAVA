const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'public', 'pages', 'admin');
const files = fs.readdirSync(adminDir);

const chatLinkMenuItem = `<a href="chat.html" class="menu-item" id="nav-chat">
                    <i class="fa-solid fa-comments menu-icon"></i> Chat Hỗ Trợ
                </a>\n                <a href="customers.html"`;

for (const file of files) {
    if (file.endsWith('.html') && file !== 'chat.html') {
        const filePath = path.join(adminDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (!content.includes('nav-chat') && content.includes('<a href="customers.html"')) {
            content = content.replace('<a href="customers.html"', chatLinkMenuItem);
            fs.writeFileSync(filePath, content);
            console.log('Added chat link to ' + file);
        } else if (file === 'chat.html') {
            // we skip chat.html
        }
    }
}
