const winston = require( "winston" );

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: {
    service: "smoke-signal-service",
    time: new Date().toISOString()
  },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" })
  ]
});

module.exports = logger;
