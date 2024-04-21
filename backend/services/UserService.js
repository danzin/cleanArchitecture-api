const bcrypt = require('bcrypt');
const MongooseService = require('./MongooseService');
const UserModel = require('../models/userModel');
const {generateToken} = require('../helpers/jwtHelper');

class UserService {

  constructor(){
    this.MongooseServiceInstance = new MongooseService(UserModel);
  }
  
  async create(newUser){
    try {
      const existingUser = await this.MongooseServiceInstance.findOne({ email: newUser.email });
      if (existingUser) {
        return { success: false, message: 'User already exists' };
      }

      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashedPassword;
      
      const token = generateToken(newUser)
      const result = await this.MongooseServiceInstance.create(newUser);
      
      return { success: true, body: {newUser: result, token} };

    } catch (e) {
      return { success:  false, body: e}
    }
  }

  async getUser(id){
    try {
      const result = await this.MongooseServiceInstance.findById(id);

      if(!result) return { success: false, body:'User not found'};
      return {success: true, body: result};
    } catch (e) {
      return { success:  false, body: e}
    }
  }

}

module.exports = UserService;