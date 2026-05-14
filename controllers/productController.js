const { getDB } = require('../db');
const { ObjectId } = require('mongodb');
const { getPostData, verifyToken, isValidObjectId } = require('../utils');

const getProducts = async (req, res) => {
    try {
        const db = getDB();
        // Sắp xếp theo số lượng (stock) giảm dần: cái nào nhiều hơn sẽ lên trước
        const products = await db.collection('products').find({}).sort({ stock: -1 }).toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(products));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

const getProductById = async (req, res) => {
    try {
        const db = getDB();
        const id = req.url.split('/')[3];
        if (!isValidObjectId(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'ID sản phẩm không hợp lệ' }));
        }
        const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
        if (product) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(product));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Product not found' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

const createProduct = async (req, res) => {
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
        const productData = JSON.parse(body);
        
        // Match schema: _id, name, category, material, stone, price, images, stock, certificate, description, isActive, createdAt
        const finalData = {
            name: productData.name,
            category: productData.category,
            material: productData.material || '',
            stone: productData.stone || '',
            price: Number(productData.price),
            images: productData.images || [productData.image], // Support array
            stock: Number(productData.stock || 0),
            certificate: productData.certificate || '',
            description: productData.description || '',
            isActive: productData.isActive !== undefined ? productData.isActive : true,
            createdAt: new Date()
        };

        const result = await db.collection('products').insertOne(finalData);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Product created', id: result.insertedId }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

const updateProduct = async (req, res) => {
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
            return res.end(JSON.stringify({ message: 'ID sản phẩm không hợp lệ' }));
        }

        const body = await getPostData(req);
        const productData = JSON.parse(body);
        
        // Remove _id and handle numbers
        delete productData._id;
        if (productData.price) productData.price = Number(productData.price);
        if (productData.stock) productData.stock = Number(productData.stock);

        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(id) },
            { $set: productData }
        );

        if (result.matchedCount === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Product not found' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Product updated' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

const deleteProduct = async (req, res) => {
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
            return res.end(JSON.stringify({ message: 'ID sản phẩm không hợp lệ' }));
        }

        const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Product not found' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Product deleted' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
