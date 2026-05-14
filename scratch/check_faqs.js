const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'jewelry_db';

async function checkCollections() {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    if (collections.find(c => c.name === 'faqs')) {
        const faqs = await db.collection('faqs').find({}).toArray();
        console.log('FAQs in DB:', JSON.stringify(faqs, null, 2));
    } else {
        console.log('No faqs collection found.');
    }
    
    await client.close();
}

checkCollections();
