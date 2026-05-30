const fs = require('fs');
let content = fs.readFileSync('public/pages/product-detail.html', 'utf8');
const insertCode = `
        // ===== LIKE & SHARE =====
        async function handleLike() {
            if (!currentProduct) return;
            const btnLike = document.getElementById('btn-like');
            const icon = btnLike.querySelector('i');
            
            try {
                const res = await window.API.likeProduct(currentProduct._id);
                if (res.liked) {
                    btnLike.classList.add('liked');
                    icon.className = 'fa-solid fa-heart';
                    icon.style.animation = 'none';
                    icon.offsetHeight; 
                    icon.style.animation = null;
                } else {
                    btnLike.classList.remove('liked');
                    icon.className = 'fa-regular fa-heart';
                }
                if(window.Cart) Cart.showToast(res.message);
            } catch (error) {
                if (error.message.includes('đăng nhập')) {
                    if(window.Cart) Cart.showToast('Vui lòng đăng nhập để thả tim!');
                    setTimeout(() => window.location.href = 'login.html', 1500);
                } else {
                    if(window.Cart) Cart.showToast(error.message);
                }
            }
        }

        async function handleShare() {
            if (!currentProduct) return;
            try {
                await window.API.shareProduct(currentProduct._id);
                const shareUrl = window.location.origin + '/share/product/' + currentProduct._id;
                
                await navigator.clipboard.writeText(shareUrl);
                if(window.Cart) Cart.showToast('Đã copy link chia sẻ sản phẩm!');
            } catch (error) {
                console.error(error);
                if(window.Cart) Cart.showToast('Lỗi khi chia sẻ sản phẩm');
            }
        }
`;

if (!content.includes('handleLike() {')) {
    content = content.replace('// ===== ZOOM LENS EFFECT =====', insertCode + '\n        // ===== ZOOM LENS EFFECT =====');
    fs.writeFileSync('public/pages/product-detail.html', content);
    console.log('Added handleLike/handleShare');
} else {
    console.log('Already exists');
}
