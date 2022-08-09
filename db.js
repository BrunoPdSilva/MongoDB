const { MongoClient } = require("mongodb");

let dbConnection;

let uri = "mongodb+srv://<username>:<password>@cluster0.g3u4tr8.mongodb.net/?retryWrites=true&w=majority"

function connectToDb(cb) {
  MongoClient.connect(uri)
    .then(client => {
      dbConnection = client.db();
      return cb();
    })
    .catch(err => {
      console.log(err);
      return cb(err);
    });
}

module.exports = { connectToDb, getDb: () => dbConnection };
