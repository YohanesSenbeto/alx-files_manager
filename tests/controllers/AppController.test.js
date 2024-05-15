const supertest = require('supertest');
const { getStatus, getStats } = require('./AppController');
const app = require('../app'); // Assuming your Express app is defined in this file

const request = supertest(app);

describe('appController Tests', () => {
  describe('gET /status', () => {
    it('should return status 200 and Redis/DB status', async () => {
      const res = await request.get('/status');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('redis');
      expect(res.body).toHaveProperty('db');
    });
  });

  describe('gET /stats', () => {
    it('should return status 200 and number of users/files', async () => {
      const res = await request.get('/stats');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('users');
      expect(res.body).toHaveProperty('files');
    });
  });
});
