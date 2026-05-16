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

const seedAll = async (req, res) => {
    try {
        const db = getDB();
        
        // 1. Clear old sample data (Optional - to avoid duplicates)
        // Keep users except admin/staff
        await db.collection('products').deleteMany({});
        await db.collection('categories').deleteMany({});
        await db.collection('users').deleteMany({ role: { $in: ['admin', 'staff'] } }); // Xóa admin cũ để tạo mới
        
        // 2. Sample Categories
        const sampleCategories = [
            { id: 'nhan', name: 'Nhẫn', images: ['/images/product-ring.png', '/images/products/soleil-main.png'] },
            { id: 'vong-tay', name: 'Vòng tay', images: ['/images/product-bracelet.png'] },
            { id: 'bong-tai', name: 'Bông tai', images: ['/images/product-earrings.png'] },
            { id: 'day-chuyen', name: 'Dây chuyền', images: ['/images/product-necklace.png'] }
        ];
        await db.collection('categories').insertMany(sampleCategories);

        // 3. Sample Users (Admin, Staff, Customer)
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        const staffPassword = await bcrypt.hash('staff123', salt);
        const userPassword = await bcrypt.hash('user123', salt);

        const sampleUsers = [
            {
                fullName: 'Admin Luxury',
                email: 'admin@anluxury.com',
                phone: '0999999999',
                password: adminPassword,
                role: 'admin',
                createdAt: new Date()
            },
            {
                fullName: 'Nhân viên Bán hàng',
                email: 'staff@anluxury.com',
                phone: '0888888888',
                password: staffPassword,
                role: 'staff',
                createdAt: new Date()
            },
            {
                fullName: 'Nguyễn Văn Khách',
                email: 'khachhang@gmail.com',
                phone: '0777777777',
                password: userPassword,
                role: 'user',
                createdAt: new Date()
            }
        ];
        await db.collection('users').insertMany(sampleUsers);

        // 4. Premium Sample Products
        const premiumProducts = [
            {
                name: 'Nhẫn Cầu Hôn Soleil 1.5 Carat',
                price: 280000000,
                category: 'nhan',
                categoryLabel: 'Nhẫn Đính Hôn',
                material: 'Vàng trắng 18K',
                stone: 'Kim cương tự nhiên',
                image: '/images/product-ring.png',
                description: 'Lấy cảm hứng từ ánh mặt trời rực rỡ, nhẫn Soleil mang thiết kế Halo cổ điển với viên kim cương chủ 1.5 Carat nước D độ tinh khiết VVS1, được bao quanh bởi dải kim cương tấm lấp lánh trên đai nhẫn vàng trắng 18K.',
                specs: { code: 'RN-SOL-015', mainStone: '1.5 Carat, Nước D, VVS1, Excellent Cut', certificate: 'GIA Certificate #8234912384' },
                stock: 5, isActive: true, createdAt: new Date()
            },
            {
                name: 'Lắc Tay Infinity Vàng Trắng 18K',
                price: 85500000,
                category: 'vong-tay',
                categoryLabel: 'Vòng tay',
                material: 'Vàng trắng 18K',
                stone: 'Kim cương tự nhiên',
                image: '/images/product-bracelet.png',
                description: 'Lắc tay Infinity tượng trưng cho tình yêu bất tận, được chế tác tinh xảo từ vàng trắng 18K với hàng kim cương đính kín quanh, tạo nên vẻ lấp lánh mê hồn trên cổ tay.',
                specs: { code: 'BR-INF-018', mainStone: 'Kim cương tổng 2.0 Carat (56 viên)', certificate: 'GIA Certificate #9123847123' },
                stock: 8, isActive: true, createdAt: new Date()
            }
        ];

        // 4. Random Generated Products (50 items)
        const materials = ['Vàng 18K', 'Vàng Trắng 14K', 'Bạch Kim (Platinum)', 'Vàng Hồng 18K'];
        const stones = ['Kim cương GIA', 'Sapphire Xanh', 'Ruby Huyết Bồ Câu', 'Emerald (Ngọc Lục Bảo)', 'Moissanite'];
        const adjective1 = ['Cao Cấp', 'Sang Trọng', 'Quý Phái', 'Tinh Tế', 'Đẳng Cấp', 'Hoàng Gia', 'Thanh Lịch'];
        const adjective2 = ['Vĩnh Cửu', 'Độc Bản', 'Tỏa Sáng', 'Quyến Rũ', 'Kiêu Sa', 'Huyền Bí'];
        
        const randomProducts = [];
        for (let i = 1; i <= 50; i++) {
            const cat = sampleCategories[Math.floor(Math.random() * sampleCategories.length)];
            const mat = materials[Math.floor(Math.random() * materials.length)];
            const stone = stones[Math.floor(Math.random() * stones.length)];
            const name = `${cat.name} ${stone} ${adjective1[Math.floor(Math.random() * adjective1.length)]} ${adjective2[Math.floor(Math.random() * adjective2.length)]} #${i + 100}`;
            const image = cat.images[Math.floor(Math.random() * cat.images.length)];
            
            randomProducts.push({
                name,
                category: cat.id,
                material: mat,
                stone,
                price: Math.floor(Math.random() * (500000000 - 15000000) + 15000000),
                image: image,
                stock: Math.floor(Math.random() * 10) + 1,
                isActive: true,
                createdAt: new Date()
            });
        }

        await db.collection('products').insertMany([...premiumProducts, ...randomProducts]);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: '✅ Đồng bộ CSDL thành công! Đã tạo: Danh mục, 52 Sản phẩm và 3 Tài khoản mẫu.' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Lỗi khi đồng bộ CSDL', error: error.message }));
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, seedAll };
