const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'public', 'pages');

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (file === 'admin') continue; // Skip admin pages for footer injections
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;

            // Hotline replacement
            if (content.includes('039 2326 230') && !content.includes('dynamic-hotline')) {
                content = content.replace(
                    /<a href="#" style="color: var\(--gold-primary\);">039 2326 230<\/a>/g,
                    '<a href="#" class="dynamic-hotline" style="color: var(--gold-primary);">039 2326 230</a>'
                );
                changed = true;
            }

            // Email replacement
            if (content.includes('cskh@anluxury.com.vn') && !content.includes('dynamic-email')) {
                content = content.replace(
                    /<a href="#" style="color: var\(--gold-primary\);">cskh@anluxury\.com\.vn<\/a>/g,
                    '<a href="mailto:cskh@anluxury.com.vn" class="dynamic-email" style="color: var(--gold-primary);">cskh@anluxury.com.vn</a>'
                );
                changed = true;
            }

            // Social links
            if (content.includes('fa-facebook-f') && !content.includes('dynamic-facebook')) {
                content = content.replace(/href="[^"]*facebook[^"]*"/g, 'href="#" class="dynamic-facebook"');
                changed = true;
            }
            if (content.includes('fa-instagram') && !content.includes('dynamic-instagram')) {
                content = content.replace(/href="[^"]*instagram[^"]*"/g, 'href="#" class="dynamic-instagram"');
                changed = true;
            }
            if (content.includes('fa-youtube') && !content.includes('dynamic-youtube')) {
                content = content.replace(/href="[^"]*youtube[^"]*"/g, 'href="#" class="dynamic-youtube"');
                changed = true;
            }
            if (content.includes('fa-tiktok') && !content.includes('dynamic-tiktok')) {
                content = content.replace(/href="[^"]*tiktok[^"]*"/g, 'href="#" class="dynamic-tiktok"');
                changed = true;
            }
            // Add Zalo if it's there
            if (content.includes('https://zalo.me/0392326230') && !content.includes('dynamic-zalo')) {
                content = content.replace(/href="https:\/\/zalo\.me\/0392326230"/g, 'href="#" class="dynamic-zalo"');
                changed = true;
            }

            // Index Banner (only for index.html)
            if (file === 'index.html') {
                if (content.includes('ĐẲNG CẤP TRANG SỨC THƯỢNG LƯU') && !content.includes('dynamic-banner-title')) {
                    content = content.replace(
                        /<h1 class="hero-title reveal">ĐẲNG CẤP TRANG SỨC THƯỢNG LƯU<\/h1>/,
                        '<h1 class="hero-title reveal dynamic-banner-title">ĐẲNG CẤP TRANG SỨC THƯỢNG LƯU</h1>'
                    );
                    changed = true;
                }
                if (content.includes('Tuyệt tác trang sức thiết kế độc quyền') && !content.includes('dynamic-banner-subtitle')) {
                    content = content.replace(
                        /<p class="hero-subtitle reveal">Tuyệt tác trang sức thiết kế độc quyền, nâng tầm vẻ đẹp và sự quý phái của bạn\.<\/p>/,
                        '<p class="hero-subtitle reveal dynamic-banner-subtitle">Tuyệt tác trang sức thiết kế độc quyền, nâng tầm vẻ đẹp và sự quý phái của bạn.</p>'
                    );
                    changed = true;
                }
                if (content.includes('hero-image.jpg') && !content.includes('dynamic-banner-image')) {
                    // It's a CSS background image on .hero, we added class support for backgrounds
                    content = content.replace(
                        /<section class="hero" id="hero">/,
                        '<section class="hero dynamic-banner-image" id="hero">'
                    );
                    changed = true;
                }
            }

            if (changed) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Injected classes into ' + fullPath);
            }
        }
    }
}

processDirectory(pagesDir);
