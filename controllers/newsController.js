const { getDB } = require('../db');
const { ObjectId } = require('mongodb');
const { getPostData, verifyToken, isValidObjectId } = require('../utils');

const getNews = async (req, res) => {
    try {
        const db = getDB();
        // Sắp xếp: Tin mới nhất (isLatest) lên đầu, sau đó đến ngày tạo giảm dần
        const news = await db.collection('news').find({}).sort({ isLatest: -1, createdAt: -1 }).toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(news));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

const createNews = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Unauthorized' }));
        }

        const db = getDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
        if (!user || user.role !== 'admin') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Forbidden' }));
        }

        const body = await getPostData(req);
        const newsData = JSON.parse(body);
        
        const finalData = {
            title: newsData.title,
            summary: newsData.summary || '',
            url: newsData.url || '#',
            image: newsData.image || '',
            isLatest: newsData.isLatest || false,
            source: newsData.source || 'An LUXURY News',
            createdAt: new Date()
        };

        const result = await db.collection('news').insertOne(finalData);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Đã thêm tin tức!', id: result.insertedId }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

const updateNews = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Unauthorized' }));
        }

        const db = getDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
        if (!user || user.role !== 'admin') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Forbidden' }));
        }

        const id = req.url.split('/')[3];
        if (!isValidObjectId(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'ID không hợp lệ' }));
        }

        const body = await getPostData(req);
        const newsData = JSON.parse(body);
        
        delete newsData._id;

        const result = await db.collection('news').updateOne(
            { _id: new ObjectId(id) },
            { $set: newsData }
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Đã cập nhật tin tức!' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

const deleteNews = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Unauthorized' }));
        }

        const db = getDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
        if (!user || user.role !== 'admin') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Forbidden' }));
        }

        const id = req.url.split('/')[3];
        const result = await db.collection('news').deleteOne({ _id: new ObjectId(id) });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Đã xóa tin tức!' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

module.exports = { getNews, createNews, updateNews, deleteNews };
