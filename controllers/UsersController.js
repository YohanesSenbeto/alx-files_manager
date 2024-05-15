const sha1 = require('sha1'); // Import the sha1 function

const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const UsersController = {
  postNew: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      // Ensure the database connection is established
      if (!dbClient.isAlive()) {
        return res
          .status(500)
          .json({ error: 'Database connection not available' });
      }

      // Retrieve the users collection from the database
      const db = dbClient.client.db(); // Access the database instance from the client
      const usersCollection = db.collection('users');

      // Check if user with same email already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash password using SHA1
      const hashedPassword = sha1(password); // Use sha1 function to hash the password
      console.log(hashedPassword);

      // Insert new user into database
      const insertionResult = await usersCollection.insertOne({
        email,
        password: hashedPassword,
      });

      // Retrieve the inserted user's id
      const userId = insertionResult.insertedId.toString();

      // Return the new user with only email and id
      return res.status(201).json({ email, id: userId });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getMe: async (req, res) => {
    try {
      const token = req.headers['x-token'];
      console.log(token);
      const userId = await redisClient.get(`auth_${token}`);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const db = dbClient.client.db(); // Access the database instance from the client
      const usersCollection = db.collection('users');

      const user = await usersCollection.findOne({ _id: userId });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      return res
        .status(200)
        .json({ id: user._id.toString(), email: user.email });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = UsersController;
