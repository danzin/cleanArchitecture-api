const bodyParser = require( "body-parser" );
const express = require( "express" );
const morgan = require( "morgan" );
const routes = require( "../routes" );
const logger = require( "../services/Logger" );
const config = require( "../config" );

class ExpressLoader {
  constructor(){
    const app = express();

    app.use(morgan("dev"));
    app.use(bodyParser.urlencoded({  
      extended: false,
      limit: "20mb"
    }));
    
    app.use(bodyParser.json({limit: "20mb"}));
    routes(app);
    app.use(ExpressLoader.errorHandler);

    this.server = app.listen(config.port, () => {
      logger.info(`Express running, now listening on port ${config.port}`);
    });
  }
  

  get Server () {
    return this.server;
  }

  static errorHandler(error, req, res, next) {
    let parsedError;

    //Gracefully parse error object
    try {
      if (error && typeof error === "object") {
        parsedError = JSON.stringify(error);
      } else {
        parsedError = error;
      }
    } catch (e) {
      logger.error(e);
    }

    // Log the original error
    logger.error(parsedError);

    // If response is already sent, don't attempt to respond to client
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
