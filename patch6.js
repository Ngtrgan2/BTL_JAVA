const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'pages');
const files = fs.readdirSync(dir);

let count = 0;
for (const file of files) {
    if (file.endsWith('.html')) {
        const filepath = path.join(dir, file);
        let content = fs.readFileSync(filepath, 'utf8');
        
        const regex = /<!-- Zalo Chat Widget -->[\s\S]*?<\/style>/g;
        if (regex.test(content)) {
            content = content.replace(regex, '');
            fs.writeFileSync(filepath, content);
            count++;
            console.log('Removed from ' + file);
        }
    }
}
console.log('Removed from ' + count + ' files');
