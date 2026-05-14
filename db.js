const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'jewelry_db';

let db;

async function connectDB() {
    if (db) return db;
    try {
        const client = await MongoClient.connect(url);
        console.log('MongoDB Connected successfully');
        db = client.db(dbName);
        return db;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };
