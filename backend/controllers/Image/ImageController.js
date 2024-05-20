const logger = require('../../services/Logger');
const ImageService = require('../../services/images/ImageService');
const ImageServiceInstance = new ImageService();

async function uploadImage (req, res) {
  try {
    let result = await ImageServiceInstance.cloudUpload(req.file.buffer, req.user.id);

    if(result.success){
      res.status(200).send(result.body);
    }else{
      res.status(500).send(result.body)
    }

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
      res.status(200).send(result.body);
    }else{
      res.status(500).send(result.body)
    }
    
  } catch (e) {
    console.error(e);
    res.status(500).send('Error removing file', e.message);
  }
}

async function getSingleImage (req, res) {
  try {
    let result = await ImageServiceInstance.getSingleImage(req.imageId);
    if(result.success){
      res.status(200).send(result.body);
    }else{
      res.status(500).send(result.body)
    }

  } catch (e) { 
    console.error(e);
    res.status(500).send('Error getting image', e.message)
  }
}

async function getImages (req, res) {

    let result = await ImageServiceInstance.getAll();
    if(result.success){
      res.status(200).send(result.body);
    }else{
      res.status(500).send(result.body)
    }
}


module.exports = { uploadImage, removeImage, getSingleImage, getImages};