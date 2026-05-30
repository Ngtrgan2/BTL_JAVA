const fs = require('fs');
let content = fs.readFileSync('public/pages/profile.html', 'utf8');

// 1. Add menu item
if (!content.includes('switchProfileTab(\'likes\'')) {
    content = content.replace(
        '<li class="profile-menu-item" onclick="switchProfileTab(\'warranty\', this)">',
        `<li class="profile-menu-item" onclick="switchProfileTab('likes', this)">
                        <i class="fa-solid fa-heart"></i> Sản phẩm yêu thích
                    </li>
                    <li class="profile-menu-item" onclick="switchProfileTab('warranty', this)">`
    );
}

// 2. Add content area
if (!content.includes('id="tab-likes"')) {
    content = content.replace(
        '<!-- Content: Warranty -->',
        `<!-- Content: Liked Products -->
                <div id="tab-likes" class="profile-content-area">
                    <h2 class="profile-section-title">Sản Phẩm Yêu Thích</h2>
                    <div id="likes-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem;">
                        <div class="empty-state" style="grid-column: 1/-1;">
                            <i class="fa-solid fa-spinner fa-spin"></i>
                            <p>Đang tải...</p>
                        </div>
                    </div>
                </div>

                <!-- Content: Warranty -->`
    );
}

// 3. Add to switchProfileTab
if (!content.includes('if (tabId === \'likes\') loadLikedProducts();')) {
    content = content.replace(
        'if (tabId === \'bookings\') loadBookings();',
        `if (tabId === 'bookings') loadBookings();
            if (tabId === 'likes') loadLikedProducts();`
    );
}

// 4. Add loadLikedProducts function
if (!content.includes('async function loadLikedProducts()')) {
    const loadLikesFunc = `
        // Load Liked Products
        async function loadLikedProducts() {
            const container = document.getElementById('likes-container');
            try {
                const products = await API.getLikedProducts();
                if (!products || products.length === 0) {
                    container.innerHTML = \`
                        <div class="empty-state" style="grid-column: 1/-1;">
                            <i class="fa-regular fa-heart"></i>
                            <p>Bạn chưa yêu thích sản phẩm nào.</p>
                            <a href="collection.html" class="btn btn-primary" style="padding: 0.8rem 1.5rem;">Khám phá ngay</a>
                        </div>
                    \`;
                    return;
                }

                container.innerHTML = products.map(product => {
                    const discount = Number(product.discountPercentage || 0);
                    const finalPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
                    return \`
                    <div class="product-card" onclick="window.location.href='product-detail.html?id=\${product._id}'" style="cursor: pointer; background: var(--bg-light); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; position: relative;">
                        <div style="aspect-ratio: 1; background: #1a1a1a;">
                            <img src="\${(product.image.startsWith('http') || product.image.startsWith('data:')) ? product.image : '..' + product.image}" alt="\${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div style="padding: 1.5rem; text-align: center;">
                            <h4 style="font-size: 1rem; margin-bottom: 0.5rem; font-weight: 600;">\${product.name}</h4>
                            <div style="color: var(--gold-primary); font-weight: bold;">\${formatPrice(finalPrice)}</div>
                        </div>
                    </div>
                    \`;
                }).join('');
            } catch (error) {
                container.innerHTML = \`
                    <div class="empty-state" style="grid-column: 1/-1;">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <p>Lỗi tải sản phẩm yêu thích.</p>
                    </div>
                \`;
            }
        }
`;
    content = content.replace('// Switch tabs', loadLikesFunc + '\n        // Switch tabs');
}

fs.writeFileSync('public/pages/profile.html', content);
console.log('profile.html updated successfully');
