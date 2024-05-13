const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  async getStatus(req, res) {
    const redisAlive = await redisClient.isAlive();
    const dbAlive = await dbClient.isAlive();
    res.json({ redis: redisAlive, db: dbAlive });
  }

  async getStats(req, res) {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();
    res.json({ users, files });
  }
}

module.exports = new AppController();
