require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;

MongoClient.connect(uri)
  .then(client => {
    const db = client.db('jewelry_db');
    db.collection('news').find({}).toArray()
      .then(news => {
        console.log(JSON.stringify(news, null, 2));
        client.close();
      })
      .catch(err => {
        console.error('Query error:', err);
        client.close();
      });
  })
  .catch(err => {
    console.error('Connection error:', err.message);
  });
