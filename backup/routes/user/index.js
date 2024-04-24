const express = require('express');
const { createUser, getUser, signIn, editUser, getUsers } = require('../../controllers/User/UserController');
const { idValidator, bodyValidator, userDetailsValidator } = require('../../middlewares/validators');
const { isAuth, isAdmin } = require('../../middlewares/auth');
let router = express.Router();

router.post('/signup', bodyValidator, createUser);
router.get('/', isAuth, isAdmin, getUsers)
router.get('/:id', idValidator, getUser);
router.post('/signin', bodyValidator, userDetailsValidator, signIn);
router.put('/:id', idValidator, bodyValidator, isAuth, editUser);


module.exports = router;

