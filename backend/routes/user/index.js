const express = require('express');
const { createUser, getUser, signIn, editUser, getUsers, signOut } = require('../../controllers/User/UserController');
const { idValidator, bodyValidator, newUserValidator, userLoginDetailsValidator } = require('../../middlewares/validators');
const { protected, isAdmin } = require('../../middlewares/auth');
let router = express.Router();

router.post('/signup', bodyValidator, newUserValidator, createUser);
router.get('/', protected, getUsers)
router.get('/:id', idValidator, getUser);
router.post('/signin', bodyValidator, userLoginDetailsValidator, signIn);
router.put('/:id', idValidator, bodyValidator, protected, editUser);
router.post('/signout', signOut)

module.exports = router;

