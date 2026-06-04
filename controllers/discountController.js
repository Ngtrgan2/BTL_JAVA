const { getDB } = require('../db');
const { ObjectId } = require('mongodb');

// === ADMIN: Lấy danh sách mã giảm giá ===
const getDiscounts = async (req, res) => {
    try {
        const db = getDB();
        const discounts = await db.collection('discounts').find({}).sort({ createdAt: -1 }).toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(discounts));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

// === ADMIN: Tạo mã giảm giá mới ===
const createDiscount = async (req, res) => {
    try {
        const db = getDB();
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                
                if (!data.code || !data.discountType || !data.discountValue) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Vui lòng điền đầy đủ Mã, Loại giảm và Giá trị' }));
                }

                // Kiểm tra mã trùng
                const existing = await db.collection('discounts').findOne({ code: data.code.toUpperCase().trim() });
                if (existing) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Mã giảm giá này đã tồn tại!' }));
                }

                const newDiscount = {
                    code: data.code.toUpperCase().trim(),
                    discountType: data.discountType, // 'percent' or 'fixed'
                    discountValue: Number(data.discountValue),
                    maxUsage: data.maxUsage ? Number(data.maxUsage) : null,
                    usedCount: 0,
                    expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
                    isActive: data.isActive !== undefined ? data.isActive : true,
                    createdAt: new Date()
                };

                const result = await db.collection('discounts').insertOne(newDiscount);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Tạo mã giảm giá thành công', id: result.insertedId }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Lỗi parse dữ liệu' }));
            }
        });
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

// === ADMIN: Cập nhật mã giảm giá ===
const updateDiscount = async (req, res) => {
    try {
        const db = getDB();
        const id = req.url.split('/')[3]; 

        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                
                const updateData = {};
                if (data.code !== undefined) updateData.code = data.code.toUpperCase().trim();
                if (data.discountType !== undefined) updateData.discountType = data.discountType;
                if (data.discountValue !== undefined) updateData.discountValue = Number(data.discountValue);
                if (data.maxUsage !== undefined) updateData.maxUsage = data.maxUsage ? Number(data.maxUsage) : null;
                if (data.expiryDate !== undefined) updateData.expiryDate = data.expiryDate ? new Date(data.expiryDate) : null;
                if (data.isActive !== undefined) updateData.isActive = data.isActive;

                const result = await db.collection('discounts').updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );

                if (result.matchedCount === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Không tìm thấy mã giảm giá' }));
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Cập nhật thành công' }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Lỗi parse dữ liệu' }));
            }
        });
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

// === ADMIN: Xóa mã giảm giá ===
const deleteDiscount = async (req, res) => {
    try {
        const db = getDB();
        const id = req.url.split('/')[3];

        if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'ID không hợp lệ' }));
        }

        const result = await db.collection('discounts').deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Không tìm thấy mã giảm giá' }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Xóa thành công' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

// === CUSTOMER: Validate mã giảm giá ===
const validateDiscount = async (req, res) => {
    try {
        const db = getDB();
        const code = req.url.split('/')[4]; // /api/discounts/validate/:code

        if (!code) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Vui lòng cung cấp mã giảm giá' }));
        }

        const discount = await db.collection('discounts').findOne({ code: code.toUpperCase().trim() });

        if (!discount) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Mã giảm giá không tồn tại' }));
        }

        if (!discount.isActive) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Mã giảm giá đã bị khóa' }));
        }

        const now = new Date();
        if (discount.expiryDate && new Date(discount.expiryDate) < now) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Mã giảm giá đã hết hạn' }));
        }

        if (discount.maxUsage && discount.usedCount >= discount.maxUsage) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Mã giảm giá đã hết lượt sử dụng' }));
        }

        // Nếu hợp lệ, trả về thông tin giảm giá
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            code: discount.code,
            discountType: discount.discountType,
            discountValue: discount.discountValue
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

module.exports = {
    getDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    validateDiscount
};
