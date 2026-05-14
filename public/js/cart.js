// ===== CART SYSTEM - localStorage =====

const Cart = {
    // Lấy giỏ hàng từ localStorage
    getItems() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    },

    // Lưu giỏ hàng
    save(items) {
        localStorage.setItem('cart', JSON.stringify(items));
        Cart.updateBadge();
    },

    // Thêm sản phẩm vào giỏ
    addItem(product, qty = 1, selectedMaterial = '', selectedSize = '') {
        // Kiểm tra đăng nhập
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            alert('Vui lòng đăng nhập để thực hiện mua sắm tại An LUXURY!');
            // Xác định đường dẫn login.html (do file js này dùng chung cho nhiều cấp thư mục)
            // Nếu đang ở trong /pages/ thì dùng 'login.html', nếu ở ngoài thì dùng 'pages/login.html'
            const path = window.location.pathname;
            if (path.includes('/pages/')) {
                window.location.href = 'login.html';
            } else {
                window.location.href = 'pages/login.html';
            }
            return false;
        }

        const items = Cart.getItems();
        // Tìm xem đã có sản phẩm cùng id + material + size chưa
        const existIndex = items.findIndex(item =>
            item.productId === product._id &&
            item.material === selectedMaterial &&
            item.size === selectedSize
        );

        if (existIndex > -1) {
            items[existIndex].quantity += qty;
        } else {
            items.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                material: selectedMaterial || (product.materials && product.materials[0]) || product.material || '',
                size: selectedSize || (product.sizes && product.sizes[0]) || '',
                stone: product.stone || '',
                certificate: product.certificate || '',
                quantity: qty
            });
        }

        Cart.save(items);
        return true;
    },

    // Cập nhật số lượng
    updateQuantity(index, newQty) {
        const items = Cart.getItems();
        if (index >= 0 && index < items.length) {
            if (newQty <= 0) {
                items.splice(index, 1);
            } else {
                items[index].quantity = newQty;
            }
            Cart.save(items);
        }
    },

    // Xóa sản phẩm
    removeItem(index) {
        const items = Cart.getItems();
        if (index >= 0 && index < items.length) {
            items.splice(index, 1);
            Cart.save(items);
        }
    },

    // Xóa toàn bộ giỏ hàng
    clear() {
        localStorage.removeItem('cart');
        Cart.updateBadge();
    },

    // Tổng số sản phẩm
    getTotalCount() {
        return Cart.getItems().reduce((sum, item) => sum + item.quantity, 0);
    },

    // Tổng tiền
    getTotalPrice() {
        return Cart.getItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    // Cập nhật badge số lượng trên header
    updateBadge() {
        const badges = document.querySelectorAll('.cart-count');
        const count = Cart.getTotalCount();
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    // Hiện thông báo toast
    showToast(message) {
        // Xóa toast cũ nếu có
        const oldToast = document.querySelector('.cart-toast');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = 'cart-toast';
        toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            border: 1px solid #d4af37;
            color: #fff;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            animation: toastSlideIn 0.3s ease-out;
        `;

        // Thêm animation CSS
        if (!document.getElementById('toast-style')) {
            const style = document.createElement('style');
            style.id = 'toast-style';
            style.textContent = `
                @keyframes toastSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes toastSlideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }
};

// Format price helper
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' ₫';
}

// Cập nhật badge khi load trang
document.addEventListener('DOMContentLoaded', () => {
    Cart.updateBadge();
});
