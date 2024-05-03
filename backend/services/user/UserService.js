const bcrypt = require('bcrypt');
const MongooseService = require('../MongooseService');
const UserModel = require('../../models/userModel');
const { generateToken } = require('../../helpers/jwtHelper');

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

      // MongooseService calls .create() creating an atomic transaction calling .save(),
      // which triggers the mongoose middleware and hashes the password
      const { username, email, _id }  = await this.MongooseServiceInstance.create(newUser);
      const token = generateToken({username, email, _id})
      return { success: true, body: { username, email, _id }, token };

    } catch (e) {
      return { success: false, body: e.message}
    }
  }

  async getUser(id){
    try {
      const result = await this.MongooseServiceInstance.findById(id);

      if(!result) return { success: false, body:'User not found'};
      return {success: true, body: result};
    } catch (e) {
      return { success:  false, body: e.message}
    }
  }

  async getUsers(){
    try {
      const result = await this.MongooseServiceInstance.find({});

      if(!result) return { success: false, body:'No users found'};
      return {success: true, body: result};
    } catch (e) {
      return { success: false, body: e.message}
    }
  }

  async signin(userCredentials) {
    try {
      const existingUser = await this.MongooseServiceInstance.findOne({ email: userCredentials.email });
     
      if(existingUser && (await existingUser.matchPassword(userCredentials.password))){

        // Generate a token
        const token = generateToken(existingUser);
        const { username, email, _id }  = existingUser;
        return { success: true, body: { username, email, _id }, token };

      }else{
        return { success: false, body: 'Invalid email or password' }
      }
   
    } catch (e) {
      return { success: false, body: e.message };
    }
  }

  async editUser(editingUser, userToEditId, newEmail, newPassword) {
    try {
      // Find the user to be edited
      const userToEdit = await this.MongooseServiceInstance.findById(userToEditId);
      if (!userToEdit) {
        return { success: false, body: 'User not found' };
      }
      if(userToEdit.isAdmin === true) return { success: false, body: 'Can not edit admin user' };

      // Check if the editing user is an admin or the user themselves
      if (!editingUser.isAdmin && editingUser.id !== userToEditId) {
        return { success: false, body: 'Unauthorized' };
      }
      // Update the user's email and/or password
      const updateBody = {};
      if (newEmail) {
        updateBody.email = newEmail;
      }
      if (newPassword) {
        updateBody.password = newPassword;
      }

      const  { username, email, _id } = await this.MongooseServiceInstance.update(userToEditId, updateBody);

      return { success: true, body: { username, email, _id } };
    } catch (e) {
      return { success: false, body: e.message };
    }
  }

}

module.exports = UserService;