const { connectDB } = require('./db');

const imageMap = {
    'nhan': {
        'Ruby Huyết Bồ Câu': '/images/products/ruby-ring.png',
        'Emerald (Ngọc Lục Bảo)': '/images/products/emerald-ring.png',
        'Kim cương GIA': '/images/products/soleil-main.png', // diamond ring
        'Sapphire Xanh': '/images/product-ring.png',
        'Moissanite': '/images/product-ring.png',
        'default': '/images/product-ring.png'
    },
    'day-chuyen': {
        'Sapphire Xanh': '/images/products/sapphire-necklace.png',
        'default': '/images/product-necklace.png'
    },
    'vong-tay': {
        'Kim cương GIA': '/images/products/diamond-bracelet.png',
        'default': '/images/product-bracelet.png'
    },
    'bong-tai': {
        'default': '/images/product-earrings.png'
    }
};

async function diversifyLocalImages() {
    try {
        const db = await connectDB();
        const productsCollection = db.collection('products');

        console.log('Đang cập nhật hình ảnh chuẩn (local) cho sản phẩm...');
        
        const products = await productsCollection.find({}).toArray();
        
        for (const product of products) {
            const categoryMapForType = imageMap[product.category] || {};
            const newImage = categoryMapForType[product.stone] || categoryMapForType['default'] || '/images/products/soleil-main.png';
            
            await productsCollection.updateOne(
                { _id: product._id },
                { 
                    $set: { 
                        image: newImage,
                        images: [newImage]
                    } 
                }
            );
            console.log(`Đã cập nhật ảnh cho: ${product.name} -> ${newImage}`);
        }

        console.log('Hoàn thành cập nhật!');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi cập nhật ảnh:', error);
        process.exit(1);
    }
}

diversifyLocalImages();
