const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'jewelry_db';

async function updatePasswords() {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const users = db.collection('users');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const result = await users.updateMany(
        { email: { $in: ['admin@anluxury.com', 'staff@anluxury.com', 'truongandzaisomot1@gmail.com'] } },
        { $set: { password: hashedPassword } }
    );

    console.log(`Updated ${result.modifiedCount} users to password '123456'.`);
    client.close();
}

updatePasswords();
