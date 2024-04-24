const jwt = require("jsonwebtoken");
const config = require('../config');


function generateToken (user) {
  try {
    return jwt.sign(
      {
        username: user.username,
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      config.JWT,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    return('Error generating token:', error);
  }
};

module.exports = { generateToken }