const fs = require('fs');
const path = require('path');

const tintucHtmlPath = path.join(__dirname, '..', 'public', 'pages', 'tintuc.html');
let html = fs.readFileSync(tintucHtmlPath, 'utf8');

const newsSectionRegex = /<!-- All News Section -->[\s\S]*?<\/section>/;
const newSection = `
    <!-- All News Section -->
    <section class="news-section" style="padding-top: 150px; padding-bottom: 4rem; min-height: 70vh; background: #111;">
        <div class="container">
            <div class="news-magazine-layout" style="display: grid; grid-template-columns: 2.2fr 1fr; gap: 2rem; max-width: 1200px; margin: 0 auto; align-items: start;">
                
                <!-- Left Column -->
                <div class="news-left-col">
                    <div id="news-featured" style="margin-bottom: 2rem; border-bottom: 1px solid #333; padding-bottom: 2rem;"></div>
                    <div id="news-mediums" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;"></div>
                </div>

                <!-- Right Column -->
                <div class="news-right-col" style="border-left: 1px solid #333; padding-left: 2rem;">
                    <div id="news-sidebar" style="display: flex; flex-direction: column;"></div>
                </div>

            </div>
            <div id="all-news-loading-msg" style="text-align: center; width: 100%; color: var(--text-muted); padding: 3rem;">Đang tải tin tức...</div>
        </div>
    </section>
`;

html = html.replace(newsSectionRegex, newSection);

// Replace the injected script
const scriptRegex = /<script>[\s\S]*?all-news-loading-msg[\s\S]*?<\/script>/;
const newScript = `
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            try {
                const newsList = await window.API.getNews();
                const loadingMsg = document.getElementById('all-news-loading-msg');
                
                if (!newsList || newsList.length === 0) {
                    if (loadingMsg) loadingMsg.innerHTML = 'Hiện chưa có tin tức nào.';
                    return;
                }
                
                if (loadingMsg) loadingMsg.style.display = 'none';

                // Helper to format time relative
                const timeAgo = (date) => {
                    const diff = Math.floor((new Date() - new Date(date)) / 60000); // in minutes
                    if(diff < 60) return diff + ' phút';
                    if(diff < 1440) return Math.floor(diff/60) + ' giờ';
                    return Math.floor(diff/1440) + ' ngày';
                };

                const featured = newsList[0];
                const mediums = newsList.slice(1, 4);
                const sidebars = newsList.slice(4);

                // Render Featured (Text left, Image right)
                if (featured) {
                    document.getElementById('news-featured').innerHTML = \`
                        <div style="display: flex; gap: 2rem; align-items: stretch; cursor: pointer;" onclick="window.open('\${featured.url}', '_blank')">
                            <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                                <h2 style="font-size: 2.2rem; font-weight: 700; color: #fff; line-height: 1.3; margin-bottom: 1rem;">\${featured.title}</h2>
                                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; font-size: 0.85rem;">
                                    <span style="color: #d32f2f; font-weight: bold; text-transform: uppercase;">\${featured.source || 'TIN TỨC'}</span>
                                    <span style="color: #888;">\${timeAgo(featured.createdAt)}</span>
                                </div>
                                <p style="color: #aaa; font-size: 1.05rem; line-height: 1.6;">\${featured.summary}</p>
                            </div>
                            <div style="flex: 1.2;">
                                <img src="\${featured.image}" alt="Featured" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px; max-height: 350px;">
                            </div>
                        </div>
                    \`;
                }

                // Render Mediums
                if (mediums.length > 0) {
                    document.getElementById('news-mediums').innerHTML = mediums.map(n => \`
                        <div style="cursor: pointer;" onclick="window.open('\${n.url}', '_blank')">
                            <div style="width: 100%; aspect-ratio: 16/9; overflow: hidden; border-radius: 4px; margin-bottom: 1rem;">
                                <img src="\${n.image || '../images/blog-thumb.jpg'}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 0.8rem; line-height: 1.4;">\${n.title}</h3>
                            <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.8rem;">
                                <span style="color: #d32f2f; font-weight: bold; text-transform: uppercase;">\${n.source || 'TIN TỨC'}</span>
                                <span style="color: #888;">\${timeAgo(n.createdAt)}</span>
                            </div>
                        </div>
                    \`).join('');
                }

                // Render Sidebars
                if (sidebars.length > 0) {
                    document.getElementById('news-sidebar').innerHTML = sidebars.map((n, i) => \`
                        <div style="cursor: pointer; padding: 1.2rem 0; \${i > 0 ? 'border-top: 1px solid #333;' : ''}" onclick="window.open('\${n.url}', '_blank')">
                            \${i === 0 && n.image ? \`
                                <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 0.5rem;">
                                    <img src="\${n.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
                                    <h3 style="font-size: 1.1rem; font-weight: 600; color: #e0e0e0; line-height: 1.4;">\${n.title}</h3>
                                </div>
                            \` : \`
                                <h3 style="font-size: 1.1rem; font-weight: 600; color: #e0e0e0; margin-bottom: 0.5rem; line-height: 1.4;">\${n.title}</h3>
                            \`}
                            <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.8rem;">
                                <span style="color: #d32f2f; font-weight: bold; text-transform: uppercase;">\${n.source || 'TIN TỨC'}</span>
                                <span style="color: #888;">\${timeAgo(n.createdAt)}</span>
                            </div>
                        </div>
                    \`).join('');
                }

            } catch (error) {
                console.error('Lỗi load tin tức:', error);
                const loadingMsg = document.getElementById('all-news-loading-msg');
                if (loadingMsg) loadingMsg.innerHTML = 'Có lỗi xảy ra khi tải tin tức.';
            }
        });
    </script>
`;

html = html.replace(scriptRegex, newScript);

fs.writeFileSync(tintucHtmlPath, html);
console.log('Updated tintuc.html with new layout!');
