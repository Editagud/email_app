const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017";

const dbname = "emailapp";
const collectionName = "users";

MongoClient.connect(url, (error, client) => {
  const db = client.db(dbname);
  const usersCollection = db.collection(collectionName);

  usersCollection.insertMany(
    [{ email: "edita.gudan@gmail.com" }, { username: "edita" }],
    (err, result) => {
      console.log(result);
    }
  );

  // close connection
  client.close();
});
