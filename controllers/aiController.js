const { getDB } = require('../db');

// === Dành cho AI: Lấy toàn bộ Context của cửa hàng ===
const getAIContext = async (req, res) => {
    try {
        const db = getDB();
        
        // 1. Lấy danh sách sản phẩm (chỉ lấy các trường cần thiết để tiết kiệm token)
        const productsRaw = await db.collection('products').find({}).toArray();
        const products = productsRaw.map(p => ({
            id: p._id.toString(),
            name: p.name,
            category: p.categoryLabel || p.category,
            price: Number(p.price),
            stock: Number(p.stock),
            material: p.material || '',
            size: p.size || ''
        }));

        // 2. Lấy danh sách mã giảm giá đang hoạt động
        const now = new Date();
        const discountsRaw = await db.collection('discounts').find({ isActive: true }).toArray();
        const activeDiscounts = discountsRaw.filter(d => {
            if (d.expiryDate && new Date(d.expiryDate) < now) return false;
            if (d.maxUsage && d.usedCount >= d.maxUsage) return false;
            return true;
        }).map(d => ({
            code: d.code,
            type: d.discountType === 'percent' ? 'Giảm theo %' : 'Giảm tiền mặt',
            value: Number(d.discountValue),
            expiry: d.expiryDate ? new Date(d.expiryDate).toLocaleDateString('vi-VN') : 'Không thời hạn'
        }));

        // 3. Thông tin cơ bản về cửa hàng
        const storeInfo = {
            name: "An LUXURY",
            address: "21/33 Bạch Đằng, Việt Nam",
            hotline: "0392326230",
            policies: {
                shipping: "Giao hàng tận nơi, có hỗ trợ ship hỏa tốc.",
                warranty: "Bảo hành làm mới, đánh bóng trọn đời. Đổi trả trong vòng 7 ngày nếu lỗi từ nhà sản xuất."
            }
        };

        const aiData = {
            store: storeInfo,
            active_discounts: activeDiscounts,
            catalog: products
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(aiData));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

module.exports = {
    getAIContext
};
