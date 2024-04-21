const express = require('express');
const {createUser, getUser} = require('../../controllers/User/UserController');
const {idValidator, bodyValidator} = require('../../middlewares/validators');
let router = express.Router();

router.post('/', bodyValidator, createUser);
router.get('/:id', idValidator, getUser);

module.exports = router;

