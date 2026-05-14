const { connectDB } = require('./db');

const imagePool = {
    'nhan': [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1544441893-675973e31d85?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1598560912005-7947c1f32e9d?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1602752250015-52934bc45613?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1603912627214-94a159934919?auto=format&fit=crop&q=80&w=800'
    ],
    'day-chuyen': [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1599643478518-a744c5b7023d?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1611085583191-a3b13634338e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'
    ],
    'bong-tai': [
        'https://images.unsplash.com/photo-1573408302355-4e0b7caf3ad6?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1617113930975-f9c732338294?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800'
    ],
    'vong-tay': [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1620921515118-49ba552674e7?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1620921571408-999335a4b76e?auto=format&fit=crop&q=80&w=800'
    ]
};

async function diversifyImages() {
    try {
        const db = await connectDB();
        const productsCollection = db.collection('products');

        console.log('Đang đa dạng hóa hình ảnh cho sản phẩm...');
        
        const products = await productsCollection.find({}).toArray();
        
        for (const product of products) {
            const category = product.category;
            const pool = imagePool[category] || imagePool['nhan']; // mặc định là nhẫn nếu ko khớp
            const newImage = pool[Math.floor(Math.random() * pool.length)];
            
            await productsCollection.updateOne(
                { _id: product._id },
                { 
                    $set: { 
                        image: newImage,
                        images: [newImage]
                    } 
                }
            );
            console.log(`Đã cập nhật ảnh cho: ${product.name}`);
        }

        console.log('Hoàn thành đa dạng hóa hình ảnh!');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi cập nhật ảnh:', error);
        process.exit(1);
    }
}

diversifyImages();
