const UserService = require('../../services/user/UserService');
const UserServiceInstance = new UserService();


async function createUser(req, res) {
  try {
    const createUser = await UserServiceInstance.create(req.body);
    return res.send(createUser);
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
      return res.send(result);
    }else{
      res.status(400).send(result)
    }
  } catch (e) {
    res.status(500).send(e);    

  }
}

async function signIn(req, res){
  try {
    const user = await UserServiceInstance.signin(req.body);
    return res.send(user);

  } catch (e) {
    res.status(500).send(e);    
  }

}

async function editUser(req, res){
  try {
    const editingUser = req.user;
    const userToEditId = req.id;
    const newEmail = req.body.email || null;
    const newPassword = req.body.password || null;

    const result = await UserServiceInstance.editUser(editingUser, userToEditId, newEmail, newPassword);

    if (result.success) {


      return res.send(result.body);

    } else {


      return res.status(400).send(result.body);

    }

  } catch (e) {
    res.status(500).send(e);    
  }
}


module.exports = { createUser, getUser, signIn, editUser, getUsers };
