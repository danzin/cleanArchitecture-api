const UserService = require('../../services/user/UserService');
const config = require('../../config');
const UserServiceInstance = new UserService();

async function createUser(req, res) {
  try {
    const result = await UserServiceInstance.create(req.body);
    if (result.success) {
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
    res.status(500).send(e);    
  }

}

async function getUser(req, res){
  try {
    const user = await UserServiceInstance.getUser(req.id);
    return res.send(user);
  } catch (e) {
    res.status(404).send(e);    
  }
}

async function getUsers(req, res){
  try {
    const result = await UserServiceInstance.getUsers();
    if(result.success){
      res.send(result);   
     }else{
      res.status(400).send(result)
    }
  } catch (e) {
    res.status(500).send(e);    

  }
}

async function signIn(req, res){
  try {
    const result = await UserServiceInstance.signin(req.body);
    if(result.success){
      const { token } = result;
      delete result.token;

      return res.cookie('jwt', token, {
        httpOnly: true,
        secure: config.env !== 'development', //true if production
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      }).status(200).send(result);
    }else{
      return res.status(400).send(result);
    }
  } catch (e) {
    res.status(500).send(e);    
  }
}

async function signOut(req, res){
  try {
    res.cookie('jwt','', {
      httpOnly: true,
      expires: new Date(0),
    }).status(200).send({message: 'Logged out'})
  } catch (e) {
    res.status(500).send(e)
  }
}


async function editUser (req, res) {
  try {
    const editingUser = req.user;
    const userToEditId = req.id;
    const newEmail = req.body.email || null;
    const newPassword = req.body.password || null;

    const result = await UserServiceInstance.editUser(editingUser, userToEditId, newEmail, newPassword);

    if (result.success) {
      return res.send(result);
    } else {
      return res.status(400).send(result);
    }

  } catch (e) {
    res.status(500).send(e);    
  }
}



module.exports = { 
  createUser,
  getUser,
  signIn,
  editUser,
  getUsers,
  signOut
};
