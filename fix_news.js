const fs = require('fs');

const path = 'public/pages/news-detail.html';
let content = fs.readFileSync(path, 'utf8');

const replacement = `<style>
        .footer-brand-outline {
            font-size: 9.5vw;
            font-family: var(--font-heading);
            color: transparent;
            -webkit-text-stroke: 1px rgba(212, 175, 55, 0.2);
            text-transform: uppercase;
            line-height: 1;
            margin-top: 1rem;
            user-select: none;
            letter-spacing: 2px;
            text-align: center;
            white-space: nowrap;
            transition: all 0.5s ease;
        }

        .footer-brand-outline:hover {
            -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5);
            text-shadow: 0 0 30px rgba(212, 175, 55, 0.1);
        }
    </style>

    <script src="../js/api.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            const params = new URLSearchParams(window.location.search);
            const newsId = params.get('id');

            try {
                const newsList = await window.API.getNews();
                const article = newsList.find(n => n._id === newsId || n.id == newsId);

                if (article) {
                    document.getElementById('page-title').textContent = \`\${article.title} | An LUXURY\`;
                    document.getElementById('news-content').innerHTML = \`
                        <div class="news-detail-header">
                            <span class="news-detail-category">\${article.category || 'Tin tức'}</span>
                            <h1 class="news-detail-title">\${article.title}</h1>
                            <div class="news-detail-meta">
                                <span><i class="fa-regular fa-calendar-days" style="margin-right: 8px;"></i> \${new Date(article.createdAt || Date.now()).toLocaleDateString('vi-VN')}</span>
                                <span><i class="fa-regular fa-user" style="margin-right: 8px;"></i> Bởi \${article.source || 'An LUXURY Editorial'}</span>
                            </div>
                        </div>
                        <div class="news-detail-img-wrap">
                            <img src="\${article.image || '../images/blog-thumb.jpg'}" alt="\${article.title}" class="news-detail-img">
                        </div>
                        <div class="news-detail-body">\${article.summary || article.content || ''}</div>
                    \`;
                } else {
                    document.getElementById('news-content').innerHTML = \`<div style="text-align: center; padding: 5rem;"><h2>Không tìm thấy bài viết</h2><a href="index.html" class="btn btn-liquid">Quay lại</a></div>\`;
                }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu tin tức:", error);
                document.getElementById('news-content').innerHTML = \`<div style="text-align: center; padding: 5rem;"><h2>Lỗi tải dữ liệu</h2><p>\${error.message}</p></div>\`;
            }

            // Floating Navigation Logic`;

content = content.replace(/<style>[\s\S]*?\.footer-brand-outline \{[\s\S]*?\/\/ Floating Navigation Logic/, replacement);

fs.writeFileSync(path, content, 'utf8');
