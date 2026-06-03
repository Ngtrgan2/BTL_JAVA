const fs = require('fs');
const path = require('path');

const newsHtmlPath = path.join(__dirname, '..', 'public', 'pages', 'admin', 'news.html');
let html = fs.readFileSync(newsHtmlPath, 'utf8');

// 1. Add CSS
const cssCode = `
        .drop-zone-area {
            border: 2px dashed rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
            background: rgba(0, 0, 0, 0.2);
            position: relative;
        }
        .drop-zone-area.dragover {
            border-color: var(--gold-primary);
            background: rgba(212, 175, 55, 0.1);
        }
        .drop-zone-area i {
            font-size: 2rem;
            color: var(--gold-primary);
            margin-bottom: 0.5rem;
            pointer-events: none;
        }
        .drop-zone-area p {
            font-size: 0.85rem;
            color: var(--admin-text-light);
            margin: 0;
            pointer-events: none;
        }
    </style>
`;
html = html.replace('</style>', cssCode);

// 2. Add Drop Zone HTML
const dropZoneHtml = `
                        <div class="form-group-admin" id="imageDropZone">
                            <label>Hình ảnh bìa</label>
                            <div class="drop-zone-area" id="dropZoneArea">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                                <p>Kéo thả ảnh vào đây hoặc dán URL</p>
                                <input type="text" id="image" class="form-control-admin" placeholder="Link ảnh hoặc Base64" style="margin-top: 10px;">
                            </div>
                        </div>
`;
html = html.replace(/<div class="form-group-admin">\s*<label>Hình ảnh bìa<\/label>\s*<input type="text" id="image".*?<\/div>/s, dropZoneHtml.trim());

// 3. Add JS Logic
const jsCode = `
            // Drag and drop logic for image
            const dropZone = document.getElementById('dropZoneArea');
            const imageInput = document.getElementById('image');
            
            if (dropZone) {
                dropZone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    dropZone.classList.add('dragover');
                });
                
                dropZone.addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    dropZone.classList.remove('dragover');
                });
                
                dropZone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    dropZone.classList.remove('dragover');
                    
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        const file = e.dataTransfer.files[0];
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
html = html.replace('loadNews();', jsCode);

fs.writeFileSync(newsHtmlPath, html);
console.log('Successfully updated news.html with drag and drop!');
