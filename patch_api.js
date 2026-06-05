const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, 'public/js/api.js');
let apiCode = fs.readFileSync(apiPath, 'utf8');

if (!apiCode.includes('getSettings:')) {
    apiCode = apiCode.replace(
        "    // Chat & Stats",
        "    // Settings\n    getSettings: () => fetchAPI('/settings'),\n    updateSettings: (data) => fetchAPI('/settings', { method: 'PUT', body: JSON.stringify(data) }),\n\n    // Chat & Stats"
    );

    // Auto-fetch settings and replace dynamic classes on page load
    const dynamicInit = `
    // Auto Load Settings
    loadGlobalSettings: async () => {
        try {
            const settings = await API.getSettings();
            if (settings) {
                // Update text elements
                document.querySelectorAll('.dynamic-hotline').forEach(el => el.textContent = settings.hotline);
                document.querySelectorAll('.dynamic-email').forEach(el => el.textContent = settings.email);
                document.querySelectorAll('.dynamic-address').forEach(el => el.textContent = settings.address);
                document.querySelectorAll('.dynamic-banner-title').forEach(el => el.textContent = settings.banner_main_title);
                document.querySelectorAll('.dynamic-banner-subtitle').forEach(el => el.textContent = settings.banner_main_subtitle);
                
                // Update Links
                document.querySelectorAll('.dynamic-facebook').forEach(el => el.href = settings.facebook_url || '#');
                document.querySelectorAll('.dynamic-instagram').forEach(el => el.href = settings.instagram_url || '#');
                document.querySelectorAll('.dynamic-youtube').forEach(el => el.href = settings.youtube_url || '#');
                document.querySelectorAll('.dynamic-tiktok').forEach(el => el.href = settings.tiktok_url || '#');
                document.querySelectorAll('.dynamic-zalo').forEach(el => el.href = settings.zalo_url || '#');
                
                // Update Banner Image if present
                document.querySelectorAll('.dynamic-banner-image').forEach(el => {
                    if (el.tagName === 'IMG') el.src = settings.banner_main_image;
                    else el.style.backgroundImage = \`url('\${settings.banner_main_image}')\`;
                });
            }
        } catch (e) {
            console.error('Failed to load global settings:', e);
        }
    }
};

// Run global settings loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (API.loadGlobalSettings) API.loadGlobalSettings();
});
`;
    apiCode = apiCode.replace(/};\s*$/, dynamicInit);

    fs.writeFileSync(apiPath, apiCode, 'utf8');
    console.log("Injected API methods and auto-load logic to api.js");
}
