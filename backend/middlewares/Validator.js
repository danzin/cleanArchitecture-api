const resMw = require( "./responses" );
const Messages = require( "../config/messages" );
const ObjectId = require("mongoose").Types.ObjectId;

class Validator {

  static idValidator = (req, res, next) =>  {
    const id = req.params.id || null;
  
    if (id && typeof id === "string" && ObjectId.isValid(id)) {
      req.id = id;
      next();
    } else {
      res.status(400).send(resMw.sendError(Messages.responses.invalidId));
    }
  }

  static bodyValidator = (req, res, next) => {
    const isValid = req.body
      && typeof req.body === "object"
      && Object.keys(req.body).length > 0;
  
      if (isValid) {
      next();
    } else {
      res.status(400).send(resMw.sendError(Messages.responses.invalidReqBody));
    }
  }
  
  static userLoginDetailsValidator = (req, res, next) => {
    const isValid = req.body.email && req.body.password;
  
    if(isValid){
      next()
    }else{
      res.status(400).send(resMw.sendError(Messages.responses.argsMissing));
    }
  }
  
  static newUserValidator = (req, res, next) => {
    const isValid = req.body.email && req.body.password && req.body.username;
  
    if(isValid){
      next();
    }else{
      res.status(400).send(resMw.sendError(Messages.responses.argsMissing));
    }
  }

}


module.exports = Validator;