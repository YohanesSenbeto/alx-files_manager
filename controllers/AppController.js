const AppController = {
  getStatus: (req, res) => {
    // Logic to check if Redis and DB are alive
    const status = {
      redis: true,
      db: true
    };
    res.status(200).json(status);
  },
  
  getStats: (req, res) => {
    // Logic to count users and files
    const stats = {
      users: 12, // Example value, replace with actual count
      files: 1231 // Example value, replace with actual count
    };
    res.status(200).json(stats);
  }
};

module.exports = AppController;
