const express = require('express');

const router = express.Router();
const UsersController = require('../controllers/UsersController');
const AppController = require('../controllers/AppController');

// User-related endpoints
router.post('/users', UsersController.postNew);

// App-related endpoints
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

module.exports = router;
