const UserService = require('../../services/user/UserService');
const config = require('../../config');
const ImageService = require('../../services/images/ImageService');

const UserServiceInstance = new UserService();
const ImageServiceInstance = new ImageService();

/**
 * Creates a new user and sets a JWT cookie on the response.
 * @param {object} req - The request object, containing the user data in `req.body`.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the created user data and sets a JWT cookie on success, or an error message on failure.
 */
async function createUser (req, res) {
  try {
    const result = await UserServiceInstance.create(req.body);
    if (result?.success) {
      const { token } = result;
      delete result.token;

      return res.cookie('jwt', token, {
        httpOnly: true,
        secure: config.env !== 'development', //true if production
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      }).status(201).send(result);
    } else {
      return res.status(400).send(result);
    }  
  } catch (e) {
    console.error(e.message)
    res.status(500).send(e.message);    
  }

}

/**
 * Retrieves a user by ID.
 * @param {object} req - The request object, containing the user ID in `req.id`.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the user data on success, or an error message on failure.
 */
async function getUser (req, res) {
    const result = await UserServiceInstance.getUser(req.id);
    if(result.success){
       res.send(result.body);   
     }else{
       result.body.message ? res.status(404).send(result.body) : res.status(500).send(result.body)
    }

}

/**
 * Retrieves all users.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends an array of user data on success, or an error message on failure.
 */
async function getUsers (req, res) {
    const result = await UserServiceInstance.getUsers();
    if(result.success){
      res.send(result.body);   
     }else{
      result.body.message ? res.status(404).send(result.body) : res.status(500).send(result.body)

    }

}

/**
 * Signs in a user and sets a JWT cookie on the response.
 * @param {object} req - The request object, containing the user credentials in `req.body`.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the user data and sets a JWT cookie on success, or an error message on failure.
 */
async function signIn (req, res) {
    const result = await UserServiceInstance.signin(req.body);
    if(result.success){
      const { token } = result;
      delete result.token;

       res.cookie('jwt', token, {
        httpOnly: true,
        secure: config.env !== 'development', //true if production
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      }).status(200).send(result);
    }else{
      result.body.message ? res.status(500).send(result.body.message) : res.status(500).send(result.body)
    }

}

/**
 * Signs out a user by clearing the JWT cookie.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends a logout confirmation message on success, or an error message on failure.
 */
async function signOut (req, res) {
  try {
    res.cookie('jwt','', {
      httpOnly: true,
      expires: new Date(0),
    }).status(200).send({message: 'Logged out'})
  } catch (e) {
    res.status(500).send(e)
  }
}

/**
 * Edits a user's email and/or password.
 * @param {object} req - The request object, containing the editing user in `req.user`, the user ID in `req.id`, and the new email and/or password in `req.body`.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the updated user data on success, or an error message on failure.
 */
async function editUser (req, res) {
  try {
    const editingUser = req.user;
    const userToEditId = req.id;
    const newEmail = req.body.email || null;
    const newPassword = req.body.password || null;

    const result = await UserServiceInstance.editUser(editingUser, userToEditId, newEmail, newPassword);

    if (result.success) {
      return res.send(result.body);
    } else {
      return res.status(400).send(result);
    }

  } catch (e) {
    res.status(500).send(e);    
  }
}

/**
 * Updates a user's avatar by uploading a new image.
 * @param {object} req - The request object, containing the user in `req.user` and the image file buffer in `req.file.buffer`.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the new avatar URL on success, or an error message on failure.
 */
async function updateAvatar(req, res) {
    const result = await ImageServiceInstance.updateAvatar(req.file.buffer, req.user.id);

    if (result.success) {
      return res.send(result.body);
    } else {
      return res.status(400).send(result);
    }
}


module.exports = { 
  createUser,
  getUser,
  signIn,
  editUser,
  getUsers,
  signOut,
  updateAvatar
};
