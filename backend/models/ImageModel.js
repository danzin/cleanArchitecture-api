const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: {type: String, required: true},
    assetId: {type: String, required: true},
    publicId: {type: String, required: true},
    createdAt: {type: Date, required: true},
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }

)



const ImageModel = mongoose.model('Image', imageSchema);
module.exports = ImageModel;