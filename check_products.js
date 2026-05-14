const { connectDB } = require('./db');

async function checkProducts() {
    try {
        const db = await connectDB();
        const products = await db.collection('products').find({ name: { $regex: '#124' } }).toArray();
        console.log("Product 124:", products[0]);
        
        const products126 = await db.collection('products').find({ name: { $regex: '#126|#127' } }).toArray();
        console.log("Products 126/127:", products126);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkProducts();
