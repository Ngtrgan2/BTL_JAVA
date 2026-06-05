const { getDB } = require('../db');
const { getPostData } = require('../utils');

const defaultSettings = {
    hotline: '039 2326 230',
    email: 'cskh@anluxury.com.vn',
    address: '21/33 Bạch Đằng, Hồng Hà, Hà Nội',
    facebook_url: 'https://www.facebook.com/ngtrgan1012/',
    instagram_url: 'https://www.instagram.com/ng_trg.an/?hl=en',
    youtube_url: 'https://www.youtube.com/@MixiGaming3con',
    tiktok_url: 'https://www.tiktok.com/@voikonnn',
    zalo_url: 'https://zalo.me/0392326230',
    banner_main_title: 'ĐẲNG CẤP TRANG SỨC THƯỢNG LƯU',
    banner_main_subtitle: 'Tuyệt tác trang sức thiết kế độc quyền, nâng tầm vẻ đẹp và sự quý phái của bạn.',
    banner_main_image: '/images/products/nhan-kim-cuong-2.jpg'
};

const getSettings = async (req, res) => {
    try {
        const db = getDB();
        let settings = await db.collection('settings').findOne({ type: 'global' });
        
        if (!settings) {
            settings = { type: 'global', ...defaultSettings };
            await db.collection('settings').insertOne(settings);
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(settings));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Lỗi máy chủ nội bộ: " + error.message }));
    }
};

const updateSettings = async (req, res) => {
    try {
        // Authenticate as Admin
        if (req.user.role !== 'admin') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Không có quyền truy cập.' }));
        }

        const body = await getPostData(req);
        const data = JSON.parse(body);

        const db = getDB();
        
        // Remove _id and type if they are passed in data to avoid updating immutable fields
        delete data._id;
        delete data.type;

        await db.collection('settings').updateOne(
            { type: 'global' },
            { $set: data },
            { upsert: true }
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Cập nhật cấu hình thành công!", data }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Lỗi máy chủ: " + error.message }));
    }
};

module.exports = { getSettings, updateSettings };
