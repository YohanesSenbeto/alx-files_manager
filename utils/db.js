import { MongoClient } from 'mongodb';

let client;

async function connectToDB() {
  try {
    client = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect(); // Connect to the MongoDB server
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

async function isAlive() {
  return client && client.isConnected();
}

async function nbUsers() {
  try {
    const db = client.db();
    const collection = db.collection('users');
    const count = await collection.countDocuments();
    return count;
  } catch (error) {
    console.error('Error counting users:', error);
    return null;
  }
}

async function nbFiles() {
  try {
    const db = client.db();
    const collection = db.collection('files');
    const count = await collection.countDocuments();
    return count;
  } catch (error) {
    console.error('Error counting files:', error);
    return null;
  }
}

export default {
  connectToDB,
  isAlive,
  nbUsers,
  nbFiles,
};
