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
    const {imageId} = req.body;
    const userId = req.user.id;

    let result = await ImageServiceInstance.removeImage(userId, imageId);
    if(result.success){
      res.status(200).send(result);
    }else{
      res.status(500).send(result.body)
    }
    
  } catch (e) {
    console.error(e);
    res.status(500).send('Error uploading file', e.message);
  }
}


module.exports = { uploadImage, removeImage };