const { connectDB } = require('./db');

const categories = [
    { id: 'nhan', name: 'Nhẫn', images: ['/images/product-ring.png', '/images/products/soleil-main.png'] },
    { id: 'vong-tay', name: 'Vòng tay', images: ['/images/product-bracelet.png'] },
    { id: 'bong-tai', name: 'Bông tai', images: ['/images/product-earrings.png'] },
    { id: 'day-chuyen', name: 'Dây chuyền', images: ['/images/product-necklace.png'] }
];

const materials = ['Vàng 18K', 'Vàng Trắng 14K', 'Bạch Kim (Platinum)', 'Vàng Hồng 18K'];
const stones = ['Kim cương GIA', 'Sapphire Xanh', 'Ruby Huyết Bồ Câu', 'Emerald (Ngọc Lục Bảo)', 'Moissanite'];
const adjective1 = ['Cao Cấp', 'Sang Trọng', 'Quý Phái', 'Tinh Tế', 'Đẳng Cấp', 'Hoàng Gia', 'Thanh Lịch'];
const adjective2 = ['Vĩnh Cửu', 'Độc Bản', 'Tỏa Sáng', 'Quyến Rũ', 'Kiêu Sa', 'Huyền Bí'];

async function seedProducts() {
    try {
        const db = await connectDB();
        const productsCollection = db.collection('products');

        console.log('Đang tạo 50 sản phẩm mới...');
        
        const newProducts = [];
        for (let i = 1; i <= 50; i++) {
            const categoryObj = categories[Math.floor(Math.random() * categories.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const stone = stones[Math.floor(Math.random() * stones.length)];
            const adj1 = adjective1[Math.floor(Math.random() * adjective1.length)];
            const adj2 = adjective2[Math.floor(Math.random() * adjective2.length)];
            
            const name = `${categoryObj.name} ${stone} ${adj1} ${adj2} #${i + 100}`;
            const price = Math.floor(Math.random() * (500000000 - 15000000) + 15000000); // 15tr - 500tr
            const image = categoryObj.images[Math.floor(Math.random() * categoryObj.images.length)];
            
            newProducts.push({
                name,
                category: categoryObj.id,
                material,
                stone,
                price,
                images: [image],
                image: image, // cho tương thích cả 2 dạng
                stock: Math.floor(Math.random() * 10) + 1,
                certificate: 'GIA ' + Math.floor(10000000 + Math.random() * 90000000),
                description: `Tuyệt tác ${name} được chế tác thủ công tỉ mỉ từ ${material} và ${stone} quý hiếm. Sản phẩm mang lại vẻ đẹp ${adj2.toLowerCase()} cho chủ nhân.`,
                isActive: true,
                createdAt: new Date()
            });
        }

        const result = await productsCollection.insertMany(newProducts);
        console.log(`Đã tạo thành công ${result.insertedCount} sản phẩm!`);
        
        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi seed sản phẩm:', error);
        process.exit(1);
    }
}

seedProducts();
