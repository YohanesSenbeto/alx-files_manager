const redis = require('redis');

class Redis {
  constructor() {
    this.client = redis.createClient({
      host: 'localhost',
      port: 6379,
      retry_strategy: () => {
        console.log('Redis connection failed. Retrying...');
      },
    });
  }

  async ping() {
    return new Promise((resolve, reject) => {
      this.client.ping((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}

module.exports = new Redis();
