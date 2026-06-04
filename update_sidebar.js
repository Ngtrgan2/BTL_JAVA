const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/pages/admin');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'discounts.html');

const regex = /(<a href="warranties\.html"\s+class="menu-item"[^>]*>\s*<i class="fa-solid fa-shield-halved menu-icon"><\/i>\s*Bảo hành\s*<\/a>)/;
const replacement = `$1
                <a href="discounts.html" class="menu-item" id="nav-discounts">
                    <i class="fa-solid fa-tags menu-icon"></i> Mã giảm giá
                </a>`;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated ' + file);
    }
});
