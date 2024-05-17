const logger = require('../../services/Logger');
const ImageService = require('../../services/images/ImageService');
const ImageServiceInstance = new ImageService();

async function uploadImage (req, res) {
  try {
    let result = await ImageServiceInstance.cloudUpload(req.file.buffer, req.user.id);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error uploading file', e.message);
  }
};

async function removeImage (req, res) {
  try {
    const {imageId} = req.body

    let result = await ImageServiceInstance.removeImage(req.params.id, imageId);
    res.status(200).send(result);
    
  } catch (e) {
    console.error(e);
    res.status(500).send('Error uploading file', e.message);
  }
}


module.exports = { uploadImage, removeImage };