const jwt = require("jsonwebtoken");
const resMw = require( "./responses" );
const config = require('../config');
const Messages = require( "../config/messages" );

const protected = (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    // returns decoded user from token or error if no/invalid token
    jwt.verify(token, config.JWT, (err, decode) => {
      if (err) {
        res.status(401).send(resMw.sendError(Messages.responses.invalidAuthToken));
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send(resMw.sendError(Messages.responses.authTokenNotProvided));
  }
};

const isAdmin = (req, res, next) => {
  if(req.user.isAdmin === true){
    next();
  }else{
    res.status(401).send(resMw.sendError(Messages.responses.forbidden))
  }
};

module.exports = { protected , isAdmin };
