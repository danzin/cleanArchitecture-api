const express = require('express');
const { getSingleImage, getImages } = require('../../controllers/Image/ImageController');
const Validator = require('../../middlewares/Validator');

let router = express.Router();

router.get('/all', getImages)
router.get('/:imageId', Validator.bodyValidator ,getSingleImage);

module.exports = router;