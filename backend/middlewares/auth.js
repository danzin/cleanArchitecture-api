const jwt = require("jsonwebtoken");
const resMw = require( "./responses" );
const config = require('../config');
const Messages = require( "../config/messages" );

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    // getting the Bearer token
    const token = authorization.slice(7, authorization.length);
    // returns decoded user from token or error if no/invalid token
    console.log(token)
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

function isAdmin (req, res, next){
  if(req.user.isAdmin === true){
    next();
  }else{
    res.status(401).send(resMw.sendError(Messages.responses.forbidden))
  }
};

module.exports = { isAuth , isAdmin };
