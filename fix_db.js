const { MongoClient } = require('mongodb');
require('dotenv').config();

async function fixDB() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('jewelry_db');
        await db.collection('settings').updateOne(
            { type: 'global' },
            { $set: { banner_main_image: '/images/products/nhan-kim-cuong-2.jpg' } }
        );
        console.log("Fixed DB");
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
fixDB();
