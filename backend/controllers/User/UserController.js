const UserService = require('../../services/UserService');
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
    res.status(500).send(e);    
  }
}

module.exports = { createUser, getUser };
