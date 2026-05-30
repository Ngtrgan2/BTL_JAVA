const fs = require('fs');
let content = fs.readFileSync('public/pages/product-detail.html', 'utf8');

// Update buttons HTML
content = content.replace(
    '<i class="fa-regular fa-heart"></i> Thả tim',
    '<i class="fa-regular fa-heart"></i> Thả tim (<span id="like-count">0</span>)'
);

content = content.replace(
    '<i class="fa-solid fa-share-nodes"></i> Chia sẻ',
    '<i class="fa-solid fa-share-nodes"></i> Chia sẻ (<span id="share-count">0</span>)'
);

// Update renderProduct to set counts
if (!content.includes('document.getElementById(\'like-count\').textContent =')) {
    content = content.replace(
        'document.getElementById(\'pd-full-desc\').textContent = product.description;',
        `document.getElementById('pd-full-desc').textContent = product.description;

            // Set counts
            const likeEl = document.getElementById('like-count');
            const shareEl = document.getElementById('share-count');
            if(likeEl) likeEl.textContent = product.likes ? product.likes.length : 0;
            if(shareEl) shareEl.textContent = product.shares || 0;`
    );
}

// Update handleLike
content = content.replace(
    'if(window.Cart) Cart.showToast(res.message);',
    `if(res.likesCount !== undefined) document.getElementById('like-count').textContent = res.likesCount;
                if(window.Cart) Cart.showToast(res.message);`
);

// Update handleShare
content = content.replace(
    'await navigator.clipboard.writeText(shareUrl);',
    `const res = await window.API.shareProduct(currentProduct._id);
                if(res.sharesCount !== undefined) document.getElementById('share-count').textContent = res.sharesCount;
                await navigator.clipboard.writeText(shareUrl);`
);
content = content.replace('await window.API.shareProduct(currentProduct._id);', ''); // Remove old call since we updated it in the block above

fs.writeFileSync('public/pages/product-detail.html', content);
console.log('product-detail.html updated successfully with counts');
