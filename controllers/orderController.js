const { getDB } = require('../db');
const { ObjectId } = require('mongodb');
const { getPostData, verifyToken, isValidObjectId } = require('../utils');

const createOrder = async (req, res) => {
    try {
        const db = getDB();
        const body = await getPostData(req);
        const parsedBody = JSON.parse(body);
        
        const decoded = verifyToken(req);
        const actualUserId = decoded ? decoded.id : null;

        // Destructure accepting both frontend formats (total/totalAmount)
        const { items, address, paymentMethod, note } = parsedBody;
        const total = parsedBody.total || parsedBody.totalAmount || 0;

        // Validate stock availability before creating order
        const LOW_STOCK_THRESHOLD = 2;
        for (const item of items) {
            const productId = item.productId || item._id;
            if (!isValidObjectId(productId)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: `ID sản phẩm "${item.name}" không hợp lệ` }));
            }
            const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
            if (!product) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: `Sản phẩm "${item.name}" không tồn tại` }));
            }
            const qty = Number(item.quantity || item.qty || 1);
            if (product.stock < qty) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: `Sản phẩm "${item.name}" chỉ còn ${product.stock} sản phẩm trong kho` }));
            }
        }

        // schema: _id, userId, items[{productId, name, price, quantity}], totalAmount, status, address, paymentMethod, createdAt
        const order = {
            userId: actualUserId,
            customerName: parsedBody.customerName || '',
            phone: parsedBody.phone || '',
            email: parsedBody.email || '',
            note: note || '',
            items: items.map(item => ({
                productId: item.productId || item._id,
                name: item.name,
                image: item.image || '',
                material: item.material || '',
                size: item.size || '',
                stone: item.stone || '',
                certificate: item.certificate || '',
                price: Number(item.price),
                quantity: Number(item.quantity || item.qty || 1)
            })),
            totalAmount: Number(total),
            status: 'pending',
            address,
            paymentMethod,
            createdAt: new Date()
        };

        const result = await db.collection('orders').insertOne(order);

        // Auto-deduct stock for each item and check low stock
        const lowStockWarnings = [];
        for (const item of order.items) {
            await db.collection('products').updateOne(
                { _id: new ObjectId(item.productId) },
                { $inc: { stock: -item.quantity } }
            );

            // Check remaining stock
            const updatedProduct = await db.collection('products').findOne({ _id: new ObjectId(item.productId) });
            if (updatedProduct && updatedProduct.stock <= LOW_STOCK_THRESHOLD) {
                lowStockWarnings.push({
                    name: updatedProduct.name,
                    remaining: updatedProduct.stock
                });
                console.log(`⚠️  CẢNH BÁO TỒN KHO: "${updatedProduct.name}" chỉ còn ${updatedProduct.stock} sản phẩm!`);
            }
        }

        const responseData = { message: 'Order created', id: result.insertedId };
        if (lowStockWarnings.length > 0) {
            responseData.lowStockWarnings = lowStockWarnings;
        }

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseData));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};


const getOrders = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Unauthorized' }));
        }

        const db = getDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
        
        if (!user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User not found' }));
        }

        let query = {};
        // If not admin/staff, only show their own orders
        if (user.role !== 'admin' && user.role !== 'staff') {
            query = { 
                $or: [
                    { userId: decoded.id },
                    { userId: new ObjectId(decoded.id) }
                ] 
            };
        }

        const orders = await db.collection('orders').find(query).toArray();
        
        // Normalize for frontend
        const normalizedOrders = orders.map(order => {
            if (order.total && !order.totalAmount) order.totalAmount = order.total;
            return order;
        });
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(normalizedOrders));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

const updateOrder = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Unauthorized' }));
        }

        const db = getDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
        if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Forbidden' }));
        }

        const id = req.url.split('/')[3];
        if (!isValidObjectId(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'ID không hợp lệ' }));
        }
        const body = await getPostData(req);
        const { status } = JSON.parse(body);

        const result = await db.collection('orders').updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        );

        if (result.matchedCount === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Order not found' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Order updated' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

const deleteOrder = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Unauthorized' }));
        }

        const db = getDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
        if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Forbidden' }));
        }

        const id = req.url.split('/')[3];
        if (!isValidObjectId(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'ID không hợp lệ' }));
        }

        const result = await db.collection('orders').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Order not found' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Order deleted' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

const getOrderById = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Unauthorized' }));
        }

        const db = getDB();
        const id = req.url.split('/')[3];
        if (!isValidObjectId(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'ID không hợp lệ' }));
        }
        
        const order = await db.collection('orders').findOne({ _id: new ObjectId(id) });
        
        if (!order) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Order not found' }));
        }

        // Check ownership
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
        const isOwner = order.userId && (order.userId.toString() === decoded.id.toString());
        const isAdmin = user && (user.role === 'admin' || user.role === 'staff');

        if (!isOwner && !isAdmin) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Forbidden: You do not have permission to view this order' }));
        }

        // Normalize for frontend
        if (order.total && !order.totalAmount) order.totalAmount = order.total;
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(order));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrder, deleteOrder };
