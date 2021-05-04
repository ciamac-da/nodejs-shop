if(process.env.NODE_ENV !== "production")
require("dotenv").config()
const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    
    MongoClient.connect(
    process.env.MongoURL, 
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
    )
    .then(client=> {
        console.log("Connected");
        callback(client)
    })
    .catch(err => {
        console.log(err)
    })
}

module.exports = mongoConnect