const supertest = require('supertest');
const { postUpload, getShow } = require('./FilesController');
const app = require('../index');
// Assuming your Express app is defined in this file
const request = supertest(app);

describe('filesController Tests', () => {
  describe('pOST /upload', () => {
    it('should upload a file and return status 201', async () => {
      const req = {
        user: { _id: 'mockUserId' },
        body: {
          name: 'testFile',
          type: 'file',
          data: 'base64Data',
        },
      };
      const res = await postUpload(req, {});
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('userId', 'mockUserId');
      expect(res.body).toHaveProperty('name', 'testFile');
    });
  });

  describe('gET /show/:id', () => {
    it('should get details of a file and return status 200', async () => {
      const req = {
        user: { _id: 'mockUserId' },
        params: { id: 'validFileId' },
      };
      const res = await getShow(req, {});
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 'validFileId');
    });
  });

  // Add test cases for other controller methods (getIndex, putPublish, putUnpublish, getFile) in a similar manner
});
