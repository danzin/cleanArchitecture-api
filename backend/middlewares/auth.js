const jwt = require("jsonwebtoken");
const resMw = require( "./responses" );
const config = require('../config');
const Messages = require( "../config/messages" );

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    //returns decoded user from auth token or error if no/invalid token
    jwt.verify(token, config.JWT_SECRET, (err, decode) => {
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

module.exports = { isAuth };
