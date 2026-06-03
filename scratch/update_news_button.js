const fs = require('fs');
const path = require('path');

const newsHtmlPath = path.join(__dirname, '..', 'public', 'pages', 'admin', 'news.html');
let html = fs.readFileSync(newsHtmlPath, 'utf8');

// 1. Revert HTML Drop Zone and insert Button
const dropZoneHtmlRegex = /<div class="form-group-admin" id="imageDropZone">[\s\S]*?<\/div>\s*<\/div>/;
const buttonHtml = `
                        <div class="form-group-admin">
                            <label>Hình ảnh bìa</label>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <input type="text" id="image" class="form-control-admin" placeholder="Link ảnh hoặc Base64" style="flex: 1;">
                                <label for="imageUploadBtn" class="btn-admin btn-primary" style="margin: 0; padding: 12px 16px; cursor: pointer; border-radius: 8px; font-weight: 500; font-size: 0.9rem; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                                    <i class="fa-solid fa-folder-open"></i> Chọn ảnh
                                </label>
                                <input type="file" id="imageUploadBtn" accept="image/*" style="display: none;">
                            </div>
                        </div>
`;
html = html.replace(dropZoneHtmlRegex, buttonHtml.trim());

// 2. Replace JS logic
const dropZoneJsRegex = /\/\/ Drag and drop logic for image[\s\S]*?loadNews\(\);/;
const buttonJs = `
            // File upload logic for image
            const imageUploadBtn = document.getElementById('imageUploadBtn');
            const imageInput = document.getElementById('image');
            
            if (imageUploadBtn) {
                imageUploadBtn.addEventListener('change', (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        if (file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                imageInput.value = event.target.result;
                                if (window.AnLuxuryNotification) {
                                    AnLuxuryNotification.show('Đã tải ảnh lên!', 'success');
                                } else {
                                    alert('Đã tải ảnh lên!');
                                }
                            };
                            reader.readAsDataURL(file);
                        } else {
                            if (window.AnLuxuryNotification) {
                                AnLuxuryNotification.show('Vui lòng chọn file ảnh!', 'error');
                            } else {
                                alert('Vui lòng chọn file ảnh!');
                            }
                        }
                    }
                });
            }

            loadNews();
`;
html = html.replace(dropZoneJsRegex, buttonJs.trim());

// 3. Remove CSS
const cssRegex = /\.drop-zone-area \{[\s\S]*?\}[\s]*<\/style>/;
html = html.replace(cssRegex, '</style>');

fs.writeFileSync(newsHtmlPath, html);
console.log('Successfully updated news.html with button upload!');
