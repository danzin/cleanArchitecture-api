const express = require('express');
const { createUser, getUser, signIn, editUser, getUsers, signOut, updateAvatar } = require('../../controllers/User/UserController');
const { uploadImage, removeImage } = require('../../controllers/Image/ImageController');
const Validator = require('../../middlewares/Validator');
const { protectedRoute, isAdmin } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/multer');

let router = express.Router();

router.post('/signup', Validator.bodyValidator, Validator.newUserValidator, createUser);
router.get('/', protectedRoute, getUsers)
router.get('/:id', Validator.userIdValidator, getUser);
router.post('/signin', Validator.bodyValidator, Validator.userLoginDetailsValidator, signIn);
router.put('/:id', Validator.userIdValidator, Validator.bodyValidator, protectedRoute, editUser);
router.post('/signout', signOut);
router.post('/avatar/:id', Validator.userIdValidator, protectedRoute, upload.single('image'), updateAvatar);

router.post('/image/upload', protectedRoute, upload.single('image'), uploadImage)
router.delete('/image/remove', Validator.bodyValidator, protectedRoute, removeImage)


module.exports = router;

