const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '..', 'public', 'pages', 'index.html');
const tintucHtmlPath = path.join(__dirname, '..', 'public', 'pages', 'tintuc.html');

let html = fs.readFileSync(indexHtmlPath, 'utf8');

// We need to keep the head, header, footer and scripts.
// We remove: hero, collection, showcase-3d, promises, about.
// And modify news section.

const heroRegex = /<section class="hero"[\s\S]*?<\/section>/;
const collectionRegex = /<section class="section container" id="collection"[\s\S]*?<\/section>/;
const showcaseRegex = /<section class="section showcase-3d-section"[\s\S]*?<\/section>/;
const promisesRegex = /<section class="section section-dark" id="promises"[\s\S]*?<\/section>/;
const aboutRegex = /<section class="section container" id="about"[\s\S]*?<\/section>/;
const newsRegex = /<section class="news-section reveal" id="news"[\s\S]*?<\/section>/;

html = html.replace(heroRegex, '');
html = html.replace(collectionRegex, '');
html = html.replace(showcaseRegex, '');
html = html.replace(promisesRegex, '');
html = html.replace(aboutRegex, '');

const customNewsSection = `
    <!-- All News Section -->
    <section class="news-section" style="padding-top: 150px; padding-bottom: 4rem; min-height: 70vh;">
        <div class="container">
            <div class="section-title">
                <h2>Tất Cả Tin Tức</h2>
            </div>
            
            <div id="all-news-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
            </div>
            
            <div id="all-news-loading-msg" style="text-align: center; width: 100%; color: var(--text-muted); padding: 3rem;">Đang tải tin tức...</div>
        </div>
    </section>
`;

html = html.replace(newsRegex, customNewsSection);

// Update title
html = html.replace('<title>An LUXURY | Trang Sức Kim Cương Cao Cấp & Đẳng Cấp</title>', '<title>Tin Tức | An LUXURY</title>');

// Now add the JS to load all news
const jsInjection = `
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            try {
                const newsList = await window.API.getNews();
                const grid = document.getElementById('all-news-grid');
                const loadingMsg = document.getElementById('all-news-loading-msg');
                
                if (!newsList || newsList.length === 0) {
                    if (loadingMsg) loadingMsg.innerHTML = 'Hiện chưa có tin tức nào.';
                    return;
                }
                
                if (loadingMsg) loadingMsg.style.display = 'none';
                
                if (grid) {
                    grid.innerHTML = newsList.map(news => \`
                        <div class="news-small-card" onclick="window.location.href='news-detail.html?id=\${news._id || news.id}'" style="cursor: pointer; background: var(--bg-light); border: 1px solid var(--border-light); border-radius: 4px; padding: 1rem; transition: transform 0.3s; display: flex; flex-direction: column; height: 100%;">
                            <div style="width: 100%; aspect-ratio: 16/9; overflow: hidden; border-radius: 4px; margin-bottom: 1rem;">
                                <img src="\${news.image || '../images/blog-thumb.jpg'}" alt="\${news.title}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.8rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">\${news.title}</h3>
                            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex-grow: 1;">\${news.summary || ""}</p>
                            <div style="margin-top: auto; font-weight: 600; font-size: 0.9rem; color: var(--gold-primary);">Xem chi tiết <i class="fa-solid fa-chevron-right" style="font-size: 0.8rem; margin-left: 4px;"></i></div>
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

html = html.replace('</body>', jsInjection + '\n</body>');

fs.writeFileSync(tintucHtmlPath, html);
console.log('Created tintuc.html successfully!');
