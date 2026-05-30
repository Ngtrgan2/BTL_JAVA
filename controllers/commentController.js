const { getDB } = require('../db');
const { ObjectId } = require('mongodb');
const { getPostData, verifyToken, isValidObjectId } = require('../utils');

const getComments = async (req, res) => {
    try {
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const productId = urlParams.get('productId');
        const page = parseInt(urlParams.get('page')) || 1;
        const limit = parseInt(urlParams.get('limit')) || 3;
        const sortType = urlParams.get('sortType') || 'newest';

        if (!productId || !isValidObjectId(productId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Missing or invalid productId' }));
        }

        const db = getDB();
        const skip = (page - 1) * limit;

        // Xây dựng Pipeline Aggregation
        let sortStage = { createdAt: -1 };
        
        if (sortType === 'helpful') {
            sortStage = { likesCount: -1, createdAt: -1 };
        } else if (sortType === 'media') {
            sortStage = { hasMedia: -1, createdAt: -1 };
        }

        const pipeline = [
            { $match: { productId: new ObjectId(productId) } },
            { 
                $addFields: {
                    likesCount: { $size: { $ifNull: ["$likes", []] } },
                    hasMedia: { $cond: [{ $ne: ["$media", null] }, 1, 0] }
                }
            },
            { $sort: sortStage },
            { $skip: skip },
            { $limit: limit }
        ];

        const [comments, countResult] = await Promise.all([
            db.collection('comments').aggregate(pipeline).toArray(),
            db.collection('comments').countDocuments({ productId: new ObjectId(productId) })
        ]);

        const totalPages = Math.ceil(countResult / limit);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            comments,
            totalPages,
            currentPage: page,
            totalComments: countResult
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

const createComment = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Bạn cần đăng nhập để bình luận' }));
        }

        const db = getDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
        if (!user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User not found' }));
        }

        // We need to parse body. To support large payload up to ~7MB, getPostData must not crash.
        const body = await getPostData(req);
        const data = JSON.parse(body);

        if (!data.productId || !isValidObjectId(data.productId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Invalid productId' }));
        }

        // Validate 5MB limit roughly via string length. 
        // 5MB * 1024 * 1024 = 5242880 bytes. Base64 is about 33% larger => ~7,000,000 chars.
        // But let's check size in bytes explicitly via Buffer
        if (data.media) {
            const buffer = Buffer.from(data.media.substring(data.media.indexOf(',') + 1), 'base64');
            if (buffer.length > 5 * 1024 * 1024) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'File hình ảnh/video vượt quá 5MB!' }));
            }
        }

        // Fetch product name to store alongside the comment
        const product = await db.collection('products').findOne({ _id: new ObjectId(data.productId) });
        const productName = product ? product.name : 'Sản phẩm';

        const newComment = {
            productId: new ObjectId(data.productId),
            productName: productName,
            userId: user._id,
            userName: user.fullName,
            userAvatar: user.avatar || null,
            userRole: user.role,
            text: data.text || '',
            media: data.media || null, // Base64 string
            mediaType: data.mediaType || null, // 'image' or 'video'
            likes: [], // Array of user IDs who liked it
            likedByAuthor: false, // Set to true if admin or staff likes it
            createdAt: new Date()
        };

        const result = await db.collection('comments').insertOne(newComment);
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Bình luận thành công', comment: newComment }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

const likeComment = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Bạn cần đăng nhập để thả tim' }));
        }

        const db = getDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
        if (!user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User not found' }));
        }

        const commentId = req.url.split('/')[3];
        if (!isValidObjectId(commentId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'ID bình luận không hợp lệ' }));
        }

        const comment = await db.collection('comments').findOne({ _id: new ObjectId(commentId) });
        if (!comment) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Không tìm thấy bình luận' }));
        }

        const isLiked = comment.likes.some(id => id.toString() === user._id.toString());
        let updateData = {};

        if (isLiked) {
            // Unlike
            updateData.$pull = { likes: user._id };
        } else {
            // Like
            updateData.$addToSet = { likes: user._id };
            if (user.role === 'admin' || user.role === 'staff') {
                updateData.$set = { likedByAuthor: true };
            }
        }

        const result = await db.collection('comments').findOneAndUpdate(
            { _id: new ObjectId(commentId) },
            updateData,
            { returnDocument: 'after' }
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: isLiked ? 'Đã bỏ thả tim' : 'Đã thả tim', comment: result }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

const deleteComment = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Chưa đăng nhập' }));
        }

        const db = getDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
        if (!user || user.role !== 'admin') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Chỉ Admin mới có quyền xóa bình luận' }));
        }

        const commentId = req.url.split('/')[3];
        if (!isValidObjectId(commentId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'ID bình luận không hợp lệ' }));
        }

        const result = await db.collection('comments').deleteOne({ _id: new ObjectId(commentId) });
        if (result.deletedCount === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Không tìm thấy bình luận' }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Đã xóa bình luận thành công' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

module.exports = { getComments, createComment, likeComment, deleteComment };
