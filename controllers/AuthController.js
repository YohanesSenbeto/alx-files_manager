const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const redisClient = require('../utils/redis');
const User = require('../models/User');

const AuthController = {
  getConnect: async (req, res) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const [email, password] = Buffer.from(
      authHeader.split(' ')[1],
      'base64',
    )
      .toString()
      .split(':');

    // Find user by email and password
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    // Generate token
    const token = uuidv4();

    // Store token in Redis
    await redisClient.set(`auth_${token}`, user.id, 'EX', 24 * 60 * 60);

    return res.status(200).send({ token }); // Added return statement
  },

  getDisconnect: async (req, res) => {
    const token = req.header('X-Token');
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    // Remove token from Redis
    await redisClient.del(`auth_${token}`);

    return res.status(204).send(); // Added return statement
  },
};

module.exports = AuthController;
