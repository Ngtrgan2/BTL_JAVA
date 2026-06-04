const { getDB } = require('../db');
const { ObjectId } = require('mongodb');

const getWarrantyByCode = async (req, res) => {
    try {
        const db = getDB();
        const code = req.url.split('/')[3]; // /api/warranty/CODE

        if (!code) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Mã bảo hành không hợp lệ' }));
        }

        const warranty = await db.collection('warranties').findOne({ 
            warrantyCode: code.toUpperCase().trim() 
        });

        if (!warranty) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Không tìm thấy thông tin bảo hành cho mã này' }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(warranty));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

// === ADMIN: Lấy toàn bộ danh sách bảo hành ===
const getWarranties = async (req, res) => {
    try {
        const db = getDB();
        const warranties = await db.collection('warranties').find({}).sort({ purchaseDate: -1 }).toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(warranties));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

// === ADMIN: Cập nhật thông tin bảo hành ===
const updateWarranty = async (req, res) => {
    try {
        const db = getDB();
        const id = req.url.split('/')[3]; // /api/warranties/ID

        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            const updates = JSON.parse(body);
            // Chỉ cho phép cập nhật các trường an toàn
            const allowedFields = ['status', 'customerName', 'phone', 'email', 'expiryDate'];
            const updateData = {};
            for (const field of allowedFields) {
                if (updates[field] !== undefined) {
                    updateData[field] = updates[field];
                }
            }

            if (updateData.expiryDate) {
                updateData.expiryDate = new Date(updateData.expiryDate);
            }

            await db.collection('warranties').updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cập nhật bảo hành thành công' }));
        });
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

// === ADMIN: Xóa bảo hành ===
const deleteWarranty = async (req, res) => {
    try {
        const db = getDB();
        const id = req.url.split('/')[3]; // /api/warranties/ID

        await db.collection('warranties').deleteOne({ _id: new ObjectId(id) });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Đã xóa bảo hành' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

module.exports = { getWarrantyByCode, getWarranties, updateWarranty, deleteWarranty };

