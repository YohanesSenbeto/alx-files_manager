const express = require('express');

const router = express.Router();
const UsersController = require('../controllers/UsersController');
const AppController = require('../controllers/AppController');
const AuthController = require('../controllers/AuthController');

// User-related endpoints
router.post('/users', UsersController.postNew);

// App-related endpoints
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Auth-related endpoints
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe); // Fix the reference to UsersController

module.exports = router;
