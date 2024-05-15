const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/UsersController");

// User-related endpoints
router.post("/users", UsersController.postNew);

module.exports = router;
