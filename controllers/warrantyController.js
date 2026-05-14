const { getDB } = require('../db');

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

module.exports = { getWarrantyByCode };
