const mongo=require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectId=mongo.ObjectId;

let database;

async function getDatabase(){
    const client = await MongoClient.connect('mongodb://127.0.0.1:27017');
    database = client.db('library');

    if(!database){
        console.log("database is not connected");
    }
 
    return database;
}

module.exports={
 getDatabase,
ObjectId
 
}