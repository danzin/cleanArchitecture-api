const ImageService = require('../../services/images/ImageService');
const ImageServiceInstance = new ImageService();

async function uploadImage (req, res) {
  try {
    let result = await ImageServiceInstance.streamUpload(req.file.buffer, req.user.id);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file');
  }
};

module.exports = { uploadImage };