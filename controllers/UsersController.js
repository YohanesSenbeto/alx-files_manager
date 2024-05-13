const redisClient = require('../utils/redisClient');

const UserController = {
  getMe: async (req, res) => {
    const token = req.header('X-Token');
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    // Retrieve user ID from Redis
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    // Find user by ID
    const user = await User.findById(userId);

    res.status(200).send({ id: user.id, email: user.email });
  },
};

module.exports = UserController;
