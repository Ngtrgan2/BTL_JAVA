const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'public/pages/admin');
const dashboardPath = path.join(adminDir, 'dashboard.html');
const settingsPath = path.join(adminDir, 'settings.html');

let dashHtml = fs.readFileSync(dashboardPath, 'utf8');

// 1. Create settings.html
const mainContentRegex = /<main class="admin-main">[\s\S]*?<\/main>/;
const settingsMain = `<main class="admin-main">
            <div class="page-header">
                <h1 class="page-title">Cấu Hình & Nội Dung</h1>
                <div class="admin-profile">
                    <div style="text-align: right;">
                        <div style="font-weight: 500;" id="user-name-display">Admin User</div>
                        <div style="font-size: 0.8rem; color: var(--admin-text-light);" id="user-email-display">admin@anluxury.com</div>
                    </div>
                </div>
            </div>

            <!-- Tab Navigation -->
            <div style="display: flex; gap: 15px; margin-bottom: 20px; border-bottom: 1px solid var(--admin-border); padding-bottom: 10px;">
                <button class="btn-admin active" id="tab-general" style="background: var(--gold-primary); color: #000; padding: 10px 20px;" onclick="switchTab('general')"><i class="fa-solid fa-gear"></i> Cấu Hình Chung</button>
                <button class="btn-admin" id="tab-banner" style="background: var(--admin-surface); color: #fff; padding: 10px 20px;" onclick="switchTab('banner')"><i class="fa-solid fa-image"></i> Quản Lý Banner</button>
            </div>

            <div class="admin-card" id="content-general">
                <h2 style="color: var(--gold-primary); margin-bottom: 20px; font-family: var(--font-heading);"><i class="fa-solid fa-address-card"></i> Thông Tin Liên Hệ</h2>
                <form id="general-settings-form" onsubmit="event.preventDefault(); saveSettings();">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="color: var(--admin-text-light); margin-bottom: 8px; display: block;">Hotline Cửa Hàng</label>
                            <input type="text" id="set-hotline" class="form-control" style="background: #111; color: #fff; border: 1px solid var(--admin-border); padding: 10px; width: 100%; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="color: var(--admin-text-light); margin-bottom: 8px; display: block;">Email CSKH</label>
                            <input type="email" id="set-email" class="form-control" style="background: #111; color: #fff; border: 1px solid var(--admin-border); padding: 10px; width: 100%; border-radius: 4px;">
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="color: var(--admin-text-light); margin-bottom: 8px; display: block;">Địa Chỉ Showroom</label>
                            <input type="text" id="set-address" class="form-control" style="background: #111; color: #fff; border: 1px solid var(--admin-border); padding: 10px; width: 100%; border-radius: 4px;">
                        </div>
                    </div>
                    
                    <h2 style="color: var(--gold-primary); margin-bottom: 20px; margin-top: 30px; font-family: var(--font-heading);"><i class="fa-solid fa-share-nodes"></i> Link Mạng Xã Hội</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="color: var(--admin-text-light); margin-bottom: 8px; display: block;"><i class="fa-brands fa-facebook" style="color: #1877F2;"></i> Facebook URL</label>
                            <input type="url" id="set-facebook" class="form-control" style="background: #111; color: #fff; border: 1px solid var(--admin-border); padding: 10px; width: 100%; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="color: var(--admin-text-light); margin-bottom: 8px; display: block;"><i class="fa-brands fa-instagram" style="color: #E1306C;"></i> Instagram URL</label>
                            <input type="url" id="set-instagram" class="form-control" style="background: #111; color: #fff; border: 1px solid var(--admin-border); padding: 10px; width: 100%; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="color: var(--admin-text-light); margin-bottom: 8px; display: block;"><i class="fa-brands fa-youtube" style="color: #FF0000;"></i> Youtube URL</label>
                            <input type="url" id="set-youtube" class="form-control" style="background: #111; color: #fff; border: 1px solid var(--admin-border); padding: 10px; width: 100%; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="color: var(--admin-text-light); margin-bottom: 8px; display: block;"><i class="fa-brands fa-tiktok" style="color: #fff;"></i> Tiktok URL</label>
                            <input type="url" id="set-tiktok" class="form-control" style="background: #111; color: #fff; border: 1px solid var(--admin-border); padding: 10px; width: 100%; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="color: var(--admin-text-light); margin-bottom: 8px; display: block;"><i class="fa-solid fa-comment-dots" style="color: #0068FF;"></i> Zalo OA URL</label>
                            <input type="url" id="set-zalo" class="form-control" style="background: #111; color: #fff; border: 1px solid var(--admin-border); padding: 10px; width: 100%; border-radius: 4px;">
                        </div>
                    </div>

                    <div style="text-align: right; margin-top: 30px;">
                        <button type="submit" class="btn-admin"><i class="fa-solid fa-save"></i> Lưu Cấu Hình Chung</button>
                    </div>
                </form>
            </div>

            <div class="admin-card" id="content-banner" style="display: none;">
                <h2 style="color: var(--gold-primary); margin-bottom: 20px; font-family: var(--font-heading);"><i class="fa-solid fa-panorama"></i> Banner Trang Chủ</h2>
                <form id="banner-settings-form" onsubmit="event.preventDefault(); saveSettings();">
                    <div style="margin-bottom: 20px;">
                        <label style="color: var(--admin-text-light); margin-bottom: 8px; display: block;">Tiêu Đề Chính (Dòng lớn)</label>
                        <input type="text" id="set-banner-title" class="form-control" style="background: #111; color: #fff; border: 1px solid var(--admin-border); padding: 10px; width: 100%; border-radius: 4px; font-family: var(--font-heading); font-size: 1.2rem;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="color: var(--admin-text-light); margin-bottom: 8px; display: block;">Mô Tả Phụ (Dòng nhỏ)</label>
                        <textarea id="set-banner-subtitle" class="form-control" style="background: #111; color: #fff; border: 1px solid var(--admin-border); padding: 10px; width: 100%; border-radius: 4px; height: 80px;"></textarea>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="color: var(--admin-text-light); margin-bottom: 8px; display: block;">Đường Dẫn Ảnh Banner (URL/Path)</label>
                        <input type="text" id="set-banner-image" class="form-control" style="background: #111; color: #fff; border: 1px solid var(--admin-border); padding: 10px; width: 100%; border-radius: 4px;" onchange="document.getElementById('banner-preview').src = this.value">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="color: var(--admin-text-light); margin-bottom: 8px; display: block;">Xem Trước Ảnh Banner</label>
                        <img id="banner-preview" src="" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; border: 1px solid var(--admin-border);">
                    </div>

                    <div style="text-align: right; margin-top: 30px;">
                        <button type="submit" class="btn-admin"><i class="fa-solid fa-save"></i> Lưu Banner</button>
                    </div>
                </form>
            </div>
        </main>`;

let settingsHtml = dashHtml.replace(/<title>.*?<\/title>/, '<title>Cấu Hình & Nội Dung | An LUXURY Admin</title>');
settingsHtml = settingsHtml.replace(mainContentRegex, settingsMain);

// Add custom JS to settings.html
const settingsScript = `
    <script>
        let currentSettings = {};

        function switchTab(tab) {
            document.getElementById('tab-general').style.background = 'var(--admin-surface)';
            document.getElementById('tab-general').style.color = '#fff';
            document.getElementById('tab-banner').style.background = 'var(--admin-surface)';
            document.getElementById('tab-banner').style.color = '#fff';
            
            document.getElementById('tab-' + tab).style.background = 'var(--gold-primary)';
            document.getElementById('tab-' + tab).style.color = '#000';

            document.getElementById('content-general').style.display = 'none';
            document.getElementById('content-banner').style.display = 'none';
            document.getElementById('content-' + tab).style.display = 'block';
        }

        async function loadSettingsData() {
            try {
                const data = await API.getSettings();
                if(data) {
                    currentSettings = data;
                    document.getElementById('set-hotline').value = data.hotline || '';
                    document.getElementById('set-email').value = data.email || '';
                    document.getElementById('set-address').value = data.address || '';
                    document.getElementById('set-facebook').value = data.facebook_url || '';
                    document.getElementById('set-instagram').value = data.instagram_url || '';
                    document.getElementById('set-youtube').value = data.youtube_url || '';
                    document.getElementById('set-tiktok').value = data.tiktok_url || '';
                    document.getElementById('set-zalo').value = data.zalo_url || '';
                    document.getElementById('set-banner-title').value = data.banner_main_title || '';
                    document.getElementById('set-banner-subtitle').value = data.banner_main_subtitle || '';
                    document.getElementById('set-banner-image').value = data.banner_main_image || '';
                    if(data.banner_main_image) document.getElementById('banner-preview').src = data.banner_main_image;
                }
            } catch(e) {
                AnLuxuryNotification.alert('Lỗi tải cấu hình: ' + e.message, 'Lỗi', 'error');
            }
        }

        async function saveSettings() {
            const data = {
                hotline: document.getElementById('set-hotline').value,
                email: document.getElementById('set-email').value,
                address: document.getElementById('set-address').value,
                facebook_url: document.getElementById('set-facebook').value,
                instagram_url: document.getElementById('set-instagram').value,
                youtube_url: document.getElementById('set-youtube').value,
                tiktok_url: document.getElementById('set-tiktok').value,
                zalo_url: document.getElementById('set-zalo').value,
                banner_main_title: document.getElementById('set-banner-title').value,
                banner_main_subtitle: document.getElementById('set-banner-subtitle').value,
                banner_main_image: document.getElementById('set-banner-image').value
            };

            try {
                const confirm = await AnLuxuryNotification.confirm('Xác nhận lưu thay đổi cấu hình?');
                if(!confirm) return;

                const res = await API.updateSettings(data);
                AnLuxuryNotification.alert(res.message, 'Thành công', 'success');
                // Refresh top-level objects if they exist
                if(API.loadGlobalSettings) API.loadGlobalSettings();
            } catch(e) {
                AnLuxuryNotification.alert('Lỗi: ' + e.message, 'Lỗi', 'error');
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const user = JSON.parse(localStorage.getItem('an_luxury_user'));
            if(user) {
                document.getElementById('user-name-display').textContent = user.fullName;
                document.getElementById('user-email-display').textContent = user.email;
            }
            loadSettingsData();
        });
    </script>
`;

settingsHtml = settingsHtml.replace('</body>', settingsScript + '\n</body>');
fs.writeFileSync(settingsPath, settingsHtml, 'utf8');

// 2. Add 'settings' to all admin sidebars
const sidebarItem = `
                <a href="settings.html" class="menu-item" id="nav-settings" style="display: none;">
                    <i class="fa-solid fa-gears menu-icon"></i> Cấu hình
                </a>
`;
const htmlFiles = fs.readdirSync(adminDir).filter(f => f.endsWith('.html'));

for(let file of htmlFiles) {
    const fPath = path.join(adminDir, file);
    let content = fs.readFileSync(fPath, 'utf8');
    
    // Check if nav-settings already exists
    if(!content.includes('id="nav-settings"')) {
        // Find customers.html in sidebar
        const customerNavRegex = /<a href="customers.html" class="menu-item" id="nav-customers" style="display: none;">\s*<i class="fa-solid fa-users menu-icon"><\/i> KhAch hAng\s*<\/a>|<a href="customers.html" class="menu-item" id="nav-customers".*?>[\s\S]*?<\/a>/;
        
        content = content.replace(customerNavRegex, match => {
            return match + sidebarItem;
        });
        fs.writeFileSync(fPath, content, 'utf8');
    }
}

// 3. We also need to update public/js/auth.js to show the nav-settings for admins
const authPath = path.join(__dirname, 'public/js/auth.js');
let authCode = fs.readFileSync(authPath, 'utf8');
if(!authCode.includes("document.getElementById('nav-settings')")) {
    authCode = authCode.replace(
        "if (navCust) navCust.style.display = 'flex';",
        "if (navCust) navCust.style.display = 'flex';\n        const navSet = document.getElementById('nav-settings');\n        if (navSet) navSet.style.display = 'flex';"
    );
    fs.writeFileSync(authPath, authCode, 'utf8');
}

console.log("Settings page created and integrated.");
