const supertest = require('supertest');
const { postNew, getMe } = require('./UsersController');
const app = require('../app'); // Assuming your Express app is defined in this file

const request = supertest(app);

describe('usersController Tests', () => {
  describe('pOST /new', () => {
    it('should create a new user and return status 201', async () => {
      // Create a mock request object
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const res = await postNew(req, {});
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('email', 'test@example.com');
      expect(res.body).toHaveProperty('id');
      // Add more assertions as needed
    });
    // Add more test cases for different scenarios
  });

  describe('gET /me', () => {
    it('should get user details and return status 200', async () => {
      // Create a mock request object with a valid token
      const req = {
        headers: { 'x-token': 'validToken' },
      };
      const res = await getMe(req, {});
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email');
      expect(res.body).toHaveProperty('id');
      // Add more assertions as needed
    });
    // Add more test cases for different scenarios
  });

  // Add test cases for other controller methods in a similar manner
});
