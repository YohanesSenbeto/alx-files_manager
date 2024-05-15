const express = require("express");

const router = express.Router();
const UsersController = require("../controllers/UsersController");
const AppController = require("../controllers/AppController");
const AuthController = require("../controllers/AuthController");
const FilesController = require("../controllers/FilesController");

// User-related endpoints
router.post("/users", UsersController.postNew);

// App-related endpoints
router.get("/status", AppController.getStatus);
router.get("/stats", AppController.getStats);
router.post("/files", FilesController.postUpload);
router.get("/files/:id", FilesController.getShow);
router.get("/files", FilesController.getIndex);
// Auth-related endpoints
router.get("/connect", AuthController.getConnect);
router.get("/disconnect", AuthController.getDisconnect);
router.get("/users/me", UsersController.getMe); // Fix the reference to UsersController

module.exports = router;
