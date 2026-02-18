// MongoDB connector (CJS)
// Keep this file focused: connect + get db

const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDb(uri) {
  if (!uri) {
    throw new Error("Missing MONGO_URI");
  }

  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
  });

  await client.connect();
  db = client.db(); // uses db name from URI
  console.log("✅ MongoDB connected");
  return db;
}

function getDb() {
  if (!db) {
    throw new Error("DB not initialized. Call connectDb() first.");
  }
  return db;
}

module.exports = { connectDb, getDb };