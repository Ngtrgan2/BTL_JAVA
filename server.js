const http = require('http');
require('dotenv').config();
const { connectDB, getDB } = require('./db');
const router = require('./router');
const socketIo = require('socket.io');
const { setupChat } = require('./controllers/chatController');

const PORT = process.env.PORT || 5000;

const fs = require('fs');
const path = require('path');

async function autoSeedProducts() {
    try {
        const db = getDB();
        const count = await db.collection('products').countDocuments();
        if (count === 0 || count < 50) { // Nếu rỗng hoặc ít quá thì xóa đi tạo lại 50 cái mới
            console.log('CSDL trống hoặc thiếu sản phẩm, đang tự động tạo 50 sản phẩm mẫu (có ảnh + video)...');
            await db.collection('products').deleteMany({});
            
            const categories = [
                { id: 'nhan', name: 'Nhẫn' },
                { id: 'vong-tay', name: 'Vòng tay' },
                { id: 'bong-tai', name: 'Bông tai' },
                { id: 'day-chuyen', name: 'Dây chuyền' }
            ];
            const materials = ['Vàng 18K', 'Vàng Trắng 14K', 'Bạch Kim (Platinum)', 'Vàng Hồng 18K'];
            const stones = ['Kim cương GIA', 'Sapphire Xanh', 'Ruby Huyết Bồ Câu', 'Emerald (Ngọc Lục Bảo)', 'Moissanite'];
            const adjective1 = ['Cao Cấp', 'Sang Trọng', 'Quý Phái', 'Tinh Tế', 'Đẳng Cấp', 'Hoàng Gia', 'Thanh Lịch'];
            const adjective2 = ['Vĩnh Cửu', 'Độc Bản', 'Tỏa Sáng', 'Quyến Rũ', 'Kiêu Sa', 'Huyền Bí'];
            
            // Đọc động danh sách ảnh và video
            let allImages = ['/images/product-ring.png', '/images/product-bracelet.png', '/images/product-earrings.png', '/images/product-necklace.png'];
            let allVideos = [];
            
            const imgDir = path.join(__dirname, 'public', 'images', 'products');
            if (fs.existsSync(imgDir)) {
                const files = fs.readdirSync(imgDir).filter(f => f.match(/\.(png|jpg|jpeg|webp)$/i));
                allImages = allImages.concat(files.map(f => `/images/products/${f}`));
            }
            
            const videoDir = path.join(__dirname, 'public', 'images', 'Video');
            if (fs.existsSync(videoDir)) {
                const vids = fs.readdirSync(videoDir).filter(f => f.match(/\.(mp4|webm)$/i));
                allVideos = allVideos.concat(vids.map(f => `/images/Video/${f}`));
            }
            
            const rootImgDir = path.join(__dirname, 'public', 'images');
            if (fs.existsSync(rootImgDir)) {
                const rootVids = fs.readdirSync(rootImgDir).filter(f => f.match(/\.(mp4|webm)$/i));
                allVideos = allVideos.concat(rootVids.map(f => `/images/${f}`));
            }

            const newProducts = [];
            for (let i = 1; i <= 50; i++) {
                const categoryObj = categories[Math.floor(Math.random() * categories.length)];
                const material = materials[Math.floor(Math.random() * materials.length)];
                const stone = stones[Math.floor(Math.random() * stones.length)];
                const adj1 = adjective1[Math.floor(Math.random() * adjective1.length)];
                const adj2 = adjective2[Math.floor(Math.random() * adjective2.length)];
                const name = `${categoryObj.name} ${stone} ${adj1} ${adj2} #${i + 100}`;
                
                // Random 2-3 ảnh
                const numImgs = Math.floor(Math.random() * 2) + 2;
                const shuffledImgs = [...allImages].sort(() => 0.5 - Math.random());
                const selectedImages = shuffledImgs.slice(0, numImgs);
                
                // Random 1-2 video
                let selectedVideos = [];
                if (allVideos.length > 0) {
                    const numVids = Math.floor(Math.random() * 2) + 1;
                    const shuffledVids = [...allVideos].sort(() => 0.5 - Math.random());
                    selectedVideos = shuffledVids.slice(0, numVids);
                }
                
                const finalImages = [...selectedImages, ...selectedVideos];

                newProducts.push({
                    name, category: categoryObj.id, material, stone, 
                    price: Math.floor(Math.random() * (500000000 - 15000000) + 15000000),
                    images: finalImages, 
                    image: selectedImages[0], 
                    stock: Math.floor(Math.random() * 10) + 1,
                    certificate: 'GIA ' + Math.floor(10000000 + Math.random() * 90000000),
                    description: `Tuyệt tác ${name} được chế tác thủ công tỉ mỉ từ ${material} và ${stone} quý hiếm.`,
                    isActive: true, createdAt: new Date()
                });
            }
            await db.collection('products').insertMany(newProducts);
            console.log('Đã tự động thêm 50 sản phẩm mẫu (kèm ảnh và video) vào CSDL!');
        }
    } catch (err) {
        console.error('Lỗi khi tự động seed sản phẩm:', err);
    }
}

async function startServer() {
    // Connect to MongoDB first
    await connectDB();
    
    // Auto-seed if empty
    await autoSeedProducts();

    const server = http.createServer((req, res) => {
        // Pass everything to router
        router(req, res);
    });

    // Initialize Socket.io
    const io = socketIo(server, { cors: { origin: "*" } });
    setupChat(io);

    server.listen(PORT, () => {
        console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
}

startServer();
