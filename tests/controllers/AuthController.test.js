const supertest = require('supertest');
const index = require('../index.js'); // Assuming your Express index is defined in this file

const request = supertest(index);

describe('authController Tests', () => {
  describe('pOST /connect', () => {
    it('should return a token on successful authentication', async () => {
      const credentials = Buffer.from(
        'test@example.com:password',
      ).toString('base64');
      const res = await request
        .post('/connect')
        .set('Authorization', `Basic ${credentials}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 if authentication fails', async () => {
      const res = await request.post('/connect');
      expect(res.status).toBe(401);
    });
  });

  describe('pOST /disconnect', () => {
    it('should revoke token and return 204 on successful disconnection', async () => {
      // Assuming you have a valid token for testing
      const token = 'valid_token_here';
      const res = await request.post('/disconnect').set('x-token', token);
      expect(res.status).toBe(204);
    });

    it('should return 401 if token is missing', async () => {
      const res = await request.post('/disconnect');
      expect(res.status).toBe(401);
    });
  });
});
