const express = require('express');
const { createUser, getUser, signIn, editUser, getUsers, signOut } = require('../../controllers/User/UserController');
const { uploadImage, removeImage } = require('../../controllers/Image/ImageController');
const { idValidator, bodyValidator, newUserValidator, userLoginDetailsValidator } = require('../../middlewares/validators');
const { protected, isAdmin } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/multer');

let router = express.Router();

router.post('/signup', bodyValidator, newUserValidator, createUser);
router.get('/', protected, getUsers)
router.get('/:id', idValidator, getUser);
router.post('/signin', bodyValidator, userLoginDetailsValidator, signIn);
router.put('/:id', idValidator, bodyValidator, protected, editUser);
router.post('/signout', signOut);

router.post('/image/upload', protected, upload.single('image'), uploadImage)
router.delete('/image/remove', bodyValidator, protected, removeImage  )


module.exports = router;

