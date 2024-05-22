const config = require('../../config');

const MongooseRepository = require('../../repositories/MongooseRepository');
const UserModel = require('../../models/UserModel');
const ImageModel = require('../../models/ImageModel');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret
});

class ImageService {
  
  constructor() {
    this.userRepository = new MongooseRepository(UserModel);
    this.imageRepository = new MongooseRepository(ImageModel);
  }

  async cloudUpload (fileBuffer, userId) {
    try {

      return MongooseRepository.initiateTransaction(async (session) => {
        const user = await this.userRepository.findById(userId, { __v: 0 }, { lean: true }, session);
        if (!user) {
          throw new Error('User not found');
        }
        if (user?.photos.length >= 10) {
          throw new Error('User not found');
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
  
        const photo = await this.imageRepository.create({
          url: result.url,
          assetId: result.asset_id,
          publicId: result.public_id,
          createdAt: result.created_at,
          user: { id: userId, username: user.username}
        }, session);
        await this.userRepository.addPhoto(userId, photo._id, {}, session);
  
   
        return { success: true, body: photo };
      });

    } catch (e) {
      return { success: true, body: e.message };
    }
  
  }

  async removeImage(userId, imagePubId) {
    try {
      
      return MongooseRepository.initiateTransaction(async (session) => {
        const user = await this.userRepository.findById(userId, { __v: 0 }, { lean: false }, session);
        if (!user) {
          return { success: false, body:' User not found' };
        }
  
        const image = await this.imageRepository.findOne({ publicId: imagePubId }, { __v: 0 }, {}, session);
        if (!image) {
          return { success: false, body: 'Image not found' };
        }

        user.photos.pull(image._id);
        const response = await cloudinary.uploader.destroy(imagePubId, { resource_type: 'image', invalidate: true });
        if(response.result == 'ok'){
          await this.userRepository.update(userId, user, { new: true }, session);
          await this.imageRepository.delete(image._id, session);
          return { success: true, body: response };

        }else{
          return { success: false, body: response };
        }
        
      });
      
    } catch (e) {
      return { success: false, body: e.message };
    }
  }


  async getSingleImage (imageId) {
    try {
      const image = await this.imageRepository.findOne({publicId: imageId});
      if(!image) return { success: false, body: 'Image not found' }
      return { success: true, body: image };
    } catch (e) {
      console.error(e);
      return { success: false, body: e.message }
    }
  }

  async getAll () {
    try {
      const images = await this.imageRepository.find({}, {createdAt: -1} );
      if(!images) return { success: false, body: 'Images not found'};
      return { success: true, body: images };
    } catch (e) {
      console.error(e);
      return { success: false, body: e.message }
    }
  }

  async updateAvatar(fileBuffer, userId) {
    try {
      return MongooseRepository.initiateTransaction(async (session) => {
        const user = await this.userRepository.findById(userId, { __v: 0 }, { lean: false }, session);
        if (!user) {
          throw new Error('User not found');
        }

        if (user.avatar) {
          const imagePubId = user.avatar.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`avatars/${imagePubId}`, { resource_type: 'image', invalidate: true });
        }

        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({
            folder: 'avatars',
            transformation: [
              { width: 300, height: 300, crop: 'fill' } 
            ]
          }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
        user.avatar = result.url;
        await user.save({ session });

        return { success: true, body: user.avatar };
      });
    } catch (e) {
      return { success: false, body: e.message };
    }
  }
}

module.exports = ImageService;
