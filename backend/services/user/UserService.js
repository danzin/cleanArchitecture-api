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

      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashedPassword;
      
      const result = await this.MongooseServiceInstance.create(newUser);
      const token = generateToken(result)

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

  async getUsers(){
    try {
      const result = await this.MongooseServiceInstance.find({});

      if(!result) return { success: false, body:'No users found'};
      return {success: true, body: result};
    } catch (e) {
      return { success:  false, body: e.message}
    }
  }

  async signin(userCredentials) {
    try {
      const existingUser = await this.MongooseServiceInstance.findOne({ email: userCredentials.email });
      if (!existingUser) {
        return { success: false, message: 'User not found' };
      }
  
      // Check the password
      const isPasswordValid = await bcrypt.compare(userCredentials.password, existingUser.password);
      if (!isPasswordValid) {
        return { success: false, message: 'Invalid password' };
      }
  
      // Generate a token
      const token = generateToken(existingUser);
  
      // Return the token and user info
      return { success: true, body: { user: existingUser, token } };
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
      console.log('editing user: ', editingUser)
      console.log('user to edit: ', userToEdit)

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
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updateBody.password = hashedPassword;
      }

      const result = await this.MongooseServiceInstance.update(userToEditId, updateBody);
      return { success: true, body: result };
    } catch (e) {
      return { success: false, body: e.message };
    }
  }


}

module.exports = UserService;