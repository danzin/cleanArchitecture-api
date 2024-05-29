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

  /**
   * Creates an instance of the ImageService class.
   * Initializes the user and image repositories with their respective Mongoose models.
   */
class ImageService {
  
  constructor() {
    this.userRepository = new MongooseRepository(UserModel);
    this.imageRepository = new MongooseRepository(ImageModel);
  }

/**
 * Uploads an image to Cloudinary, creates an image document in the database, and associates it with the user.
 * The process is performed within a MongoDB transaction to ensure consistency.
 * @param {Buffer} fileBuffer - The buffer of the image file to upload.
 * @param {string} userId - The ID of the user uploading the image.
 * @returns {Promise} Returns a Promise that resolves to an object indicating success and the new photo document, or an error message on failure.
 * @throws {Error} Throws an error if the transaction fails and is aborted.
 */
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

/**
 * Removes an image from Cloudinary and deletes the associated image document from the database.
 * The process is performed within a MongoDB transaction to ensure consistency.
 * @param {string} userId - The ID of the user who owns the image.
 * @param {string} imagePubId - The public ID of the image to remove from Cloudinary.
 * @returns {Promise} Returns a Promise that resolves to an object indicating success or failure of the image removal process.
 * @throws {Error} Throws an error if the transaction fails and is aborted.
 */
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

  /**
   * Retrieves a single image document by its public ID.
   * @param {string} imageId - The public ID of the image to retrieve.
   * @returns {Promise} Returns a Promise that resolves to an object indicating success and the image document, or an error message on failure.
   */
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

  /**
   * Retrieves all image documents, sorted by creation date in descending order.
   * @returns {Promise} Returns a Promise that resolves to an object indicating success and an array of image documents, or an error message on failure.
   */
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

  /**
 * Updates the avatar of a user by uploading a new image to Cloudinary and saving the new URL in the user's document.
 * The process is performed within a MongoDB transaction to ensure consistency.
 * @param {Buffer} fileBuffer - The buffer of the new avatar image file.
 * @param {string} userId - The ID of the user whose avatar is to be updated.
 * @returns {Promise} Returns a Promise that resolves to an object indicating success and the new avatar URL, or an error message on failure.
 * @throws {Error} Throws an error if the transaction fails and is aborted.
 */
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
