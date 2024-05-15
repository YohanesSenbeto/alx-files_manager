// AppController.js

const {
    getRedisStatus,
    getDBStatus,
    countUsers,
    countFiles,
} = require("../utils/utils");

// Controller for /status endpoint
const getStatus = async (req, res) => {
    try {
        const redisStatus = await getRedisStatus();
        const dbStatus = await getDBStatus();
        res.status(200).json({ redis: redisStatus, db: dbStatus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Controller for /stats endpoint
const getStats = async (req, res) => {
    try {
        const numUsers = await countUsers();
        const numFiles = await countFiles();
        res.status(200).json({ users: numUsers, files: numFiles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getStatus, getStats };
