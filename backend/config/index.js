const dotenv = require('dotenv');
dotenv.config();

let config = {
  dbUrl: process.env.MONGODB_URI || "mongodb://localhost/test-db",
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  logDir: process.env.LOGDIR || "logs",
  viewEngine: process.env.VIEW_ENGINE || "html",
  JWT: process.env.JWT_SECRET
};

module.exports = config;