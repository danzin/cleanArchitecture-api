const express = require('express');
const { createUser, getUser, signIn, editUser, getUsers, signOut } = require('../../controllers/User/UserController');
const { uploadImage, removeImage } = require('../../controllers/Image/ImageController');
const Validator = require('../../middlewares/Validator');
const { protected, isAdmin } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/multer');

let router = express.Router();

router.post('/signup', Validator.bodyValidator, Validator.newUserValidator, createUser);
router.get('/', protected, getUsers)
router.get('/:id', Validator.idValidator, getUser);
router.post('/signin', Validator.bodyValidator, Validator.userLoginDetailsValidator, signIn);
router.put('/:id', Validator.idValidator, Validator.bodyValidator, protected, editUser);
router.post('/signout', signOut);

router.post('/image/upload', protected, upload.single('image'), uploadImage)
router.delete('/image/remove', Validator.bodyValidator, protected, removeImage  )


module.exports = router;

