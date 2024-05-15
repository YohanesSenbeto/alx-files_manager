// Import the necessary modules
const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';

// Database Name
const dbName = 'files_manager';

// Mock data to be inserted
const mockUsers = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
  { name: 'Charlie', email: 'charlie@example.com' },
];

const mockFiles = [
  { name: 'File1.txt', size: 1024, user_id: 1 },
  { name: 'File2.txt', size: 2048, user_id: 2 },
  { name: 'File3.txt', size: 4096, user_id: 3 },
];

// Function to insert mock data into the database
async function insertMockData() {
  // Create a new MongoClient
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    // Connect to the MongoDB server
    await client.connect();

    // Select the database
    const db = client.db(dbName);

    // Insert mock users into the 'users' collection
    const usersCollection = db.collection('users');
    await usersCollection.insertMany(mockUsers);

    // Insert mock files into the 'files' collection
    const filesCollection = db.collection('files');
    await filesCollection.insertMany(mockFiles);

    console.log('Mock data inserted successfully.');
  } catch (error) {
    console.error('Error inserting mock data:', error);
  } finally {
    // Close the client connection
    await client.close();
  }
}

// Call the insertMockData function to insert mock data
insertMockData();
