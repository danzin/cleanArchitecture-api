const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: {type: String, required: true},
    assetId: {type: String, required: true},
    publicId: {type: String, required: true},
    createdAt: {type: Date, required: true},
    user:{
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      username: String  
    } 
  }

)



const ImageModel = mongoose.model('Image', imageSchema);
module.exports = ImageModel;