const { MongoClient } = require('mongodb');
const uri = 'mongodb://truongandzaisomot_db_user:an101205@ac-fkcwvvl-shard-00-00.nnqcyjd.mongodb.net:27017,ac-fkcwvvl-shard-00-01.nnqcyjd.mongodb.net:27017,ac-fkcwvvl-shard-00-02.nnqcyjd.mongodb.net:27017/jewelry_db?ssl=true&replicaSet=atlas-fkcwvvl-shard-0&authSource=admin&retryWrites=true&w=majority';
MongoClient.connect(uri)
  .then(client => {
    console.log('Connected!');
    client.close();
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
