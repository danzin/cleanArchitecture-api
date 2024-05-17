const config = require( "./config" );
const mongoose = require( "mongoose" );
const logger = require( "./services/Logger" );

//Plug in the native ES6 promise library instead of mpromise
mongoose.Promise = global.Promise;

// Connect to the DB an initialize the app if successful
mongoose.connect(config.dbUrl)
  .then(() => {
    
    logger.info( `Database connection successful; connected to: ${config.dbUrl}`);

    // Create express instance to setup API
    const ExpressLoader = require("./loaders/Express");
    new ExpressLoader();
  })
  .catch(err => {
    console.error(err);
    logger.error(err);
  });