const MongoClient = require('mongodb').MongoClient;
const redis = require('redis');

class AppController {
  static async getStatus(req, res) {
    try {
      const client = redis.createClient();
      await client.connect();
      const redisAlive = await client.ping();
      const dbClient = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
      const db = dbClient.db();
      await db.command({ ping: 1 });
      res.status(200).json({ redis: redisAlive, db: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getStats(req, res) {
    try {
      const dbClient = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
      const db = dbClient.db();
      const usersCount = await db.collection('users').countDocuments();
      const filesCount = await db.collection('files').countDocuments();
      res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = AppController;
