// AppController.js

const {
  getRedisStatus,
  getDBStatus,
  countUsers,
  countFiles,
} = require('../utils/utils');

// Controller for /status endpoint
const getStatus = (req, res) => {
  const redisStatus = getRedisStatus();
  const dbStatus = getDBStatus();
  res.status(200).json({ redis: redisStatus, db: dbStatus });
};

// Controller for /stats endpoint
const getStats = (req, res) => {
  const numUsers = countUsers();
  const numFiles = countFiles();
  res.status(200).json({ users: numUsers, files: numFiles });
};

module.exports = { getStatus, getStats };
