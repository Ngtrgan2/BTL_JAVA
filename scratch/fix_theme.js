const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'pages', 'tintuc.html');
let html = fs.readFileSync(filePath, 'utf8');

// Replace HTML part
html = html.replace(/background:\s*#111;?/g, 'background: transparent;');
html = html.replace(/border-bottom:\s*1px solid #333;?/g, 'border-bottom: 1px solid var(--border-light);');
html = html.replace(/border-left:\s*1px solid #333;?/g, 'border-left: 1px solid var(--border-light);');

// Replace JS part
html = html.replace(/color:\s*#fff;?/g, 'color: var(--text-primary);');
html = html.replace(/color:\s*#e0e0e0;?/g, 'color: var(--text-primary);');
html = html.replace(/color:\s*#aaa;?/g, 'color: var(--text-secondary);');
html = html.replace(/color:\s*#888;?/g, 'color: var(--text-muted);');
html = html.replace(/border-top:\s*1px solid #333;?/g, 'border-top: 1px solid var(--border-light);');

// The news layout wrapper div
html = html.replace(/<section class="news-section" style="([^"]*?)">/g, (match, p1) => {
    return `<section class="news-section" style="padding-top: 150px; padding-bottom: 4rem; min-height: 70vh;">`;
});


fs.writeFileSync(filePath, html);
console.log('Fixed theme colors in tintuc.html');
