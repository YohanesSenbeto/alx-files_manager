const redis = require("redis");

class RedisClient {
    constructor() {
        this.client = redis.createClient();
        this.client.on("error", (err) => {
            console.error("Redis error:", err);
        });
    }

    async isAlive() {
        try {
            await this.client.ping();
            return true;
        } catch (err) {
            return false;
        }
    }

    async get(key) {
        try {
            return await new Promise((resolve, reject) => {
                this.client.get(key, (err, value) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(value);
                    }
                });
            });
        } catch (err) {
            console.error("Error getting value from Redis:", err);
            return null;
        }
    }

    async set(key, value, duration) {
        try {
            return await new Promise((resolve, reject) => {
                this.client.setex(key, duration, value, (err, reply) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(reply);
                    }
                });
            });
        } catch (err) {
            console.error("Error setting value in Redis:", err);
            return null;
        }
    }

    async del(key) {
        try {
            return await new Promise((resolve, reject) => {
                this.client.del(key, (err, count) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(count);
                    }
                });
            });
        } catch (err) {
            console.error("Error deleting value from Redis:", err);
            return null;
        }
    }
}

const redisClient = new RedisClient();
export default redisClient;
