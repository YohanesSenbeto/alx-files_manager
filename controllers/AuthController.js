const sha1 = require('sha1');
const dbClient = require('../utils/db');

const AuthController = {
  getConnect: async (req, res) => {
    try {
      const auth = req.headers.authorization;
      if (!auth) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Extracting email and password from Basic Auth header
      const encodedCredentials = auth.split(' ')[1];
      const decodedCredentials = Buffer.from(
        encodedCredentials,
        'base64',
      ).toString('utf-8');
      const [email, password] = decodedCredentials.split(':');

      // Check if email and password are provided
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: 'Missing email or password' });
      }

      // Retrieve the users collection from the database
      const db = dbClient.db(); // Access the database instance from the client
      const usersCollection = db.collection('users');

      // Find the user by email and hashed password
      const hashedPassword = sha1(password);
      const user = await usersCollection.findOne({
        email,
        password: hashedPassword,
      });

      // If user is not found, return Unauthorized
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Generate a random token (you can use any token generation method here)
      const token = Math.random().toString(36).substring(2, 15)
                + Math.random().toString(36).substring(2, 15);

      // Store the token in Redis with a TTL of 24 hours
      await dbClient.set(
        `auth_${token}`,
        user._id.toString(),
        'EX',
        86400,
      );

      // Return the token
      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getDisconnect: async (req, res) => {
    try {
      const token = req.headers['x-token'];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Delete the token from Redis
      await dbClient.del(`auth_${token}`);

      // Return success response
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = AuthController;
