const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'jewelry_db';

async function upgradeUser() {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const users = db.collection('users');

    const result = await users.updateOne(
        { email: 'truongandzaisomot1@gmail.com' },
        { $set: { role: 'admin' } }
    );

    console.log(`Upgraded user to admin: ${result.modifiedCount}`);
    client.close();
}

upgradeUser();
