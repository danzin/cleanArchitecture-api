const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const routes = require("../routes");
const logger = require("../services/Logger");
const config = require("../config");
const cookieParser = require('cookie-parser');

class ExpressLoader {
  constructor() {
    const app = express();

    // Set up middleware
    app.use(morgan("dev"));
    app.use(bodyParser.urlencoded({  
      extended: false,
      limit: "20mb"
    }));
    app.use(express.json());
    app.use(cookieParser());
    routes(app);

    // Set up error handling
    app.use(ExpressLoader.errorHandler);

    if (process.env.NODE_ENV !== 'test') {
      this.server = app.listen(config.port, () => {
        logger.info(`Express running, now listening on port ${config.port}`);
      });
    }

    // Store the app instance
    this.app = app; 
  }

  get Server() {
    return this.server;
  }

  get App() {
    return this.app;
  }

  /**
   * @description Default error handler to be used with express
   * @param error Error object
   * @param req {object} Express req object
   * @param res {object} Express res object
   * @param next {function} Express next object
   * @returns {*}
   */
  static errorHandler(error, req, res, next) {
    let parsedError;

    try {
      if (error && typeof error === "object") {
        parsedError = JSON.stringify(error);
      } else {
        parsedError = error;
      }
    } catch (e) {
      logger.error(e);
    }

    logger.error(parsedError);

    if (res.headersSent) {
      return next(error);
    }

    res.status(400).json({
      success: false,
      error
    });
  }
}

module.exports = ExpressLoader;
