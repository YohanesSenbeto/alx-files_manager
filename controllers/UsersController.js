const sha1 = require('sha1');
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
      const hashedPassword = sha1(password);

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
};

module.exports = UsersController;
