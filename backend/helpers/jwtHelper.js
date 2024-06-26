const jwt = require("jsonwebtoken");
const config = require('../config');


const generateToken = (user) => {
  try {
    return jwt.sign(
      {
        username: user.username,
        id: user._id,
        isAdmin: user.isAdmin,
      },
      config.JWT,
      {
        expiresIn: "30d",
      }
    );  
      
  } catch (e) {
    return('Error generating token:', e);
  }
};


module.exports = { generateToken }