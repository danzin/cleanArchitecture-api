const config = require( "./config" );
const mongoose = require( "mongoose" );
const logger = require( "./services/Logger" );




mongoose.Promise = global.Promise;

// Connect to the DB an initialize the app if successful
mongoose.connect(config.dbUrl)
  .then( () => {
    
    logger.info( `Database connection successful; connected to: ${config.dbUrl}`);

    // Create express instance to setup API
    const ExpressLoader = require("./loaders/Express");
    new ExpressLoader();
  } )
  .catch(err => {
    //eslint-disable-next-line
    console.error(err);
    logger.error(err);
  });