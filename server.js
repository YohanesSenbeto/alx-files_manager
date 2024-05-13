const express = require('express');
const app = express();
const redisClient = require('./utils/redis');
const dbClient = require('./utils/db');

app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port 5000');
});

app.use(express.json());
app.use('/status', require('./routes/index'));

app.listen();
