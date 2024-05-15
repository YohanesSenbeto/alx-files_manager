// Function to check Redis status
const getRedisStatus = () => true; // Mock data: Assuming Redis is always alive

// Function to check database status
const getDBStatus = () => true; // Mock data: Assuming database is always alive

// Function to count users in the database
const countUsers = () => 4; // Mock data: Assuming there are 4 users

// Function to count files in the database
const countFiles = () => 30; // Mock data: Assuming there are 30 files

module.exports = {
    getRedisStatus,
    getDBStatus,
    countUsers,
    countFiles,
};
