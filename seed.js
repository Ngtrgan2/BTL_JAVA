require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'jewelry_db';

const seedData = async () => {
    let client;
    try {
        client = await MongoClient.connect(url);
        const db = client.db(dbName);

        // Xóa dữ liệu mẫu cũ (chỉ xóa Admin/Staff để giữ lại tài khoản Khách Hàng)
        await db.collection('users').deleteMany({ role: { $in: ['admin', 'staff'] } });
        await db.collection('products').deleteMany({});

        console.log('Đang tạo dữ liệu mẫu (Pure MongoDB)...');

        // 1. Tạo Admin
        const salt = await bcrypt.genSalt(10);
        const hashedAdminPassword = await bcrypt.hash('admin123', salt);
        
        await db.collection('users').insertOne({
            fullName: 'Quản trị viên',
            email: 'admin@anluxury.com',
            phone: '000000000',
            password: hashedAdminPassword,
            role: 'admin',
            createdAt: new Date()
        });
        console.log('Đã tạo User Admin thành công!');

        // 2. Tạo Sản phẩm
        await db.collection('products').insertMany([
            {
                name: 'Nhẫn Cầu Hôn Soleil 1.5 Carat',
                price: 280000000,
                category: 'nhan',
                categoryLabel: 'Nhẫn Đính Hôn',
                material: 'Vàng trắng 18K',
                stone: 'Kim cương tự nhiên',
                image: '/images/product-ring.png',
                description: 'Lấy cảm hứng từ ánh mặt trời rực rỡ, nhẫn Soleil mang thiết kế Halo cổ điển với viên kim cương chủ 1.5 Carat nước D độ tinh khiết VVS1, được bao quanh bởi dải kim cương tấm lấp lánh trên đai nhẫn vàng trắng 18K.',
                specs: {
                    code: 'RN-SOL-015',
                    mainStone: '1.5 Carat, Nước D, VVS1, Excellent Cut',
                    certificate: 'GIA Certificate #8234912384',
                    sideStone: '0.45 Carat tổng (24 viên)',
                    brand: 'An LUXURY',
                    weight: '4.8g'
                },
                materials: ['Vàng Trắng 18K', 'Platinum 950', 'Vàng Hồng 18K'],
                sizes: [8, 9, 10, 11, 12, 13, 14],
                stock: 5,
                isActive: true,
                createdAt: new Date()
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
                specs: {
                    code: 'BR-INF-018',
                    mainStone: 'Kim cương tổng 2.0 Carat (56 viên)',
                    certificate: 'GIA Certificate #9123847123',
                    sideStone: 'Không có',
                    brand: 'An LUXURY',
                    weight: '12.5g'
                },
                materials: ['Vàng Trắng 18K', 'Vàng Hồng 18K'],
                sizes: [16, 17, 18, 19, 20],
                stock: 8,
                isActive: true,
                createdAt: new Date()
            },
            {
                name: 'Hoa Tai Ngọc Trai South Sea',
                price: 65000000,
                category: 'bong-tai',
                categoryLabel: 'Bông tai',
                material: 'Vàng 18K',
                stone: 'Ngọc trai South Sea',
                image: '/images/product-earrings.png',
                description: 'Đôi hoa tai mang vẻ đẹp thanh lịch với ngọc trai South Sea tự nhiên màu trắng ánh vàng, kích thước 12-13mm, được bao quanh bởi kim cương và đính trên nền vàng 18K tinh tế.',
                specs: {
                    code: 'ER-SPR-012',
                    mainStone: 'Ngọc trai South Sea 12-13mm, Trắng Ánh Vàng',
                    certificate: 'GIA Pearl Report #71238471',
                    sideStone: '0.8 Carat kim cương (32 viên)',
                    brand: 'An LUXURY',
                    weight: '8.2g'
                },
                materials: ['Vàng 18K', 'Vàng Trắng 18K'],
                sizes: [],
                stock: 3,
                isActive: true,
                createdAt: new Date()
            },
            {
                name: 'Mặt Dây Chuyền Sapphire Xanh',
                price: 112000000,
                category: 'day-chuyen',
                categoryLabel: 'Dây chuyền',
                material: 'Vàng trắng 18K',
                stone: 'Sapphire Ceylon',
                image: '/images/product-necklace.png',
                description: 'Mặt dây chuyền nổi bật với viên Sapphire xanh Ceylon 3.2 Carat, được bao quanh bởi hai hàng kim cương tấm lấp lánh, tạo nên vẻ đẹp quý phái và sang trọng bậc nhất.',
                specs: {
                    code: 'NK-SAP-032',
                    mainStone: 'Sapphire Ceylon 3.2 Carat, Xanh Hoàng Gia',
                    certificate: 'GIA Certificate #5512834712',
                    sideStone: '1.2 Carat kim cương (48 viên)',
                    brand: 'An LUXURY',
                    weight: '6.5g'
                },
                materials: ['Vàng Trắng 18K', 'Platinum 950'],
                sizes: [],
                stock: 2,
                isActive: true,
                createdAt: new Date()
            },
            {
                name: 'Nhẫn Nam Vương Giả',
                price: 140000000,
                category: 'nhan',
                categoryLabel: 'Nhẫn',
                material: 'Vàng 18K',
                stone: 'Kim cương tự nhiên',
                image: '/images/product-ring.png',
                description: 'Nhẫn nam với thiết kế mạnh mẽ, khẳng định đẳng cấp phái mạnh. Viên kim cương chủ 0.8 Carat nước E được đặt trong thiết kế bezel hiện đại trên nền vàng 18K.',
                specs: {
                    code: 'RN-KNG-008',
                    mainStone: '0.8 Carat, Nước E, VS1, Very Good Cut',
                    certificate: 'GIA Certificate #3348912001',
                    sideStone: 'Không có',
                    brand: 'An LUXURY',
                    weight: '8.2g'
                },
                materials: ['Vàng 18K', 'Vàng Trắng 18K'],
                sizes: [17, 18, 19, 20, 21, 22],
                stock: 4,
                isActive: true,
                createdAt: new Date()
            },
            {
                name: 'Dây Chuyền Giọt Nước Lam Ngọc',
                price: 125000000,
                category: 'day-chuyen',
                categoryLabel: 'Dây chuyền',
                material: 'Vàng trắng 18K',
                stone: 'Sapphire',
                image: '/images/product-necklace.png',
                description: 'Dây chuyền mang hình giọt nước thanh thoát với viên Sapphire xanh lam 2.5 Carat, được bao quanh bởi kim cương trắng và đính trên dây chuyền vàng trắng 18K dài 45cm.',
                specs: {
                    code: 'NK-DRO-025',
                    mainStone: 'Sapphire 2.5 Carat, Xanh Lam',
                    certificate: 'GIA Certificate #7734821901',
                    sideStone: '0.6 Carat kim cương (28 viên)',
                    brand: 'An LUXURY',
                    weight: '5.8g'
                },
                materials: ['Vàng Trắng 18K'],
                sizes: [],
                stock: 6,
                isActive: true,
                createdAt: new Date()
            }
        ]);
        console.log('Đã tạo Danh sách Sản phẩm mẫu thành công!');

        console.log('Hoàn tất!');
        process.exit();
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
        process.exit(1);
    }
};

seedData();
