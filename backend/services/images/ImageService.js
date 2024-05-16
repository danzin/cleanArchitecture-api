const config = require('../../config');
const cloudinary = require('cloudinary').v2;
const UserModel = require('../../models/userModel');
const MongooseService = require('../MongooseService');
const streamifier = require('streamifier');

// Configure Cloudinary with the credentials
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret
});

class ImageService {
  
  constructor(){
    this.MongooseServiceInstance = new MongooseService(UserModel);
  }

   async streamUpload (fileBuffer, userId) {
    try {

      const user = await this.MongooseServiceInstance.findById(userId);
      if(!user){
        return {success: false, body: 'User not found'}
      }

      const result = await new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
      await this.MongooseServiceInstance.addPhotoToUser(userId,result.url)
      return {success: true, body: result};
      
    } catch (error) {
      // Handle the error by throwing it
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }
};


module.exports = ImageService;
