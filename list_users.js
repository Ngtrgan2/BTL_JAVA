const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'jewelry_db';

async function listUsers() {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const users = db.collection('users');
    const allUsers = await users.find({}).toArray();
    console.log(JSON.stringify(allUsers.map(u => ({fullName: u.fullName, email: u.email, role: u.role})), null, 2));
    client.close();
}

listUsers();
