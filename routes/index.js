const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');
const AuthController = require('../controllers/AuthController');
const UsersController = require('../controllers/UsersController');
const FilesController = require('../controllers/FilesController');
const { basicAuthenticate, xTokenAuthenticate } = require('../middlewares/auth');
const { APIError, errorResponse } = require('../middlewares/error');

// App routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Authentication routes
router.get('/connect', basicAuthenticate, AuthController.getConnect);
router.get('/disconnect', xTokenAuthenticate, AuthController.getDisconnect);

// User routes
router.post('/users', UsersController.postNew);
router.get('/users/me', xTokenAuthenticate, UsersController.getMe);

// File routes
router.post('/files', xTokenAuthenticate, FilesController.postUpload);
router.get('/files/:id', xTokenAuthenticate, FilesController.getShow);
router.get('/files', xTokenAuthenticate, FilesController.getIndex);
router.put('/files/:id/publish', xTokenAuthenticate, FilesController.putPublish);
router.put('/files/:id/unpublish', xTokenAuthenticate, FilesController.putUnpublish);
router.get('/files/:id/data', FilesController.getFile);

// Error handling middleware
router.use((req, res, next) => {
  next(new APIError(404, `Cannot ${req.method} ${req.url}`));
});

router.use(errorResponse);

module.exports = router;
