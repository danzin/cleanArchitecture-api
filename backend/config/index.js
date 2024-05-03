const dotenv = require('dotenv');
dotenv.config();

let config = {
  dbUrl: process.env.MONGODB_URI || "mongodb://localhost/test-db",
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  logDir: process.env.LOGDIR || "logs",
  viewEngine: process.env.VIEW_ENGINE || "html",
  JWT: process.env.JWT_SECRET,
  //cloudinary creds
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_KEY, 
  api_secret: process.env.CLOUD_SECRET

};

module.exports = config;