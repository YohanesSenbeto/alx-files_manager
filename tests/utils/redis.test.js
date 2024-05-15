const RedisClient = require('./RedisClient');

describe('redisClient Tests', () => {
  let redisClient;

  beforeAll(() => {
    redisClient = new RedisClient();
  });

  afterAll(() => {
    redisClient.client.quit(); // Close the Redis client connection after all tests
  });

  it('isAlive method should return true when the Redis connection is alive', () => {
    expect(redisClient.isAlive()).toBeTruthy();
  });

  it('get method should retrieve the value associated with the key', async () => {
    const key = 'testKey';
    const value = 'testValue';
    await redisClient.set(key, value, 60); // Set a key-value pair for testing
    const retrievedValue = await redisClient.get(key);
    expect(retrievedValue).toBe(value);
  });

  it('del method should delete the key from Redis', async () => {
    const key = 'testKey';
    await redisClient.set(key, 'testValue', 60); // Set a key-value pair for testing
    const count = await redisClient.del(key);
    expect(count).toBe(1); // Expecting 1 key to be deleted
  });
});
