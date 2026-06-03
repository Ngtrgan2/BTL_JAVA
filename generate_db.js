const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, 'DB');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const categories = [
    { 
        id: 'nhan', name: 'Nhẫn', 
        images: ['/images/product-ring.png', '/images/products/soleil-main.png', '/images/products/soleil-side.png', '/images/products/soleil-macro.png', '/images/products/soleil-box.png', '/images/products/ruby-ring.png', '/images/products/emerald-ring.png'] 
    },
    { 
        id: 'vong-tay', name: 'Vòng tay', 
        images: ['/images/product-bracelet.png', '/images/products/diamond-bracelet.png'] 
    },
    { 
        id: 'bong-tai', name: 'Bông tai', 
        images: ['/images/product-earrings.png'] 
    },
    { 
        id: 'day-chuyen', name: 'Dây chuyền', 
        images: ['/images/product-necklace.png', '/images/products/sapphire-necklace.png'] 
    }
];

const materials = ['Vàng 18K', 'Vàng Trắng 14K', 'Bạch Kim (Platinum)', 'Vàng Hồng 18K'];
const stones = ['Kim cương GIA', 'Sapphire Xanh', 'Ruby Huyết Bồ Câu', 'Emerald (Ngọc Lục Bảo)', 'Moissanite'];
const adjective1 = ['Cao Cấp', 'Sang Trọng', 'Quý Phái', 'Tinh Tế', 'Đẳng Cấp', 'Hoàng Gia', 'Thanh Lịch'];
const adjective2 = ['Vĩnh Cửu', 'Độc Bản', 'Tỏa Sáng', 'Quyến Rũ', 'Kiêu Sa', 'Huyền Bí'];

const videoDir = path.join(__dirname, 'public', 'images', 'Video');
let allVideos = [];
if (fs.existsSync(videoDir)) {
    const vids = fs.readdirSync(videoDir).filter(f => f.match(/\.(mp4|webm)$/i));
    allVideos = allVideos.concat(vids.map(f => `/images/Video/${f}`));
}

const newProducts = [];
for (let i = 1; i <= 50; i++) {
    const categoryObj = categories[Math.floor(Math.random() * categories.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const stone = stones[Math.floor(Math.random() * stones.length)];
    const adj1 = adjective1[Math.floor(Math.random() * adjective1.length)];
    const adj2 = adjective2[Math.floor(Math.random() * adjective2.length)];
    const name = `${categoryObj.name} ${stone} ${adj1} ${adj2} #${i + 100}`;
    
    const numImgs = Math.floor(Math.random() * 2) + 1;
    const shuffledImgs = [...categoryObj.images].sort(() => 0.5 - Math.random());
    const selectedImages = shuffledImgs.slice(0, numImgs);
    
    let selectedVideos = [];
    if (allVideos.length > 0) {
        selectedVideos = [[...allVideos].sort(() => 0.5 - Math.random())[0]];
    }
    
    const finalImages = [...selectedImages, ...selectedVideos];

    newProducts.push({
        name: name,
        category: categoryObj.id,
        material: material,
        stone: stone,
        price: Math.floor(Math.random() * (500000000 - 15000000) + 15000000),
        images: finalImages,
        image: selectedImages[0],
        stock: Math.floor(Math.random() * 10) + 1,
        certificate: 'GIA ' + Math.floor(10000000 + Math.random() * 90000000),
        description: `Tuyệt tác ${name} được chế tác thủ công tỉ mỉ từ ${material} và ${stone} quý hiếm.`,
        isActive: true,
        createdAt: { "$date": new Date().toISOString() }
    });
}

const outputPath = path.join(dbDir, 'product.json');
fs.writeFileSync(outputPath, JSON.stringify(newProducts, null, 2), 'utf8');
console.log('Done!');
