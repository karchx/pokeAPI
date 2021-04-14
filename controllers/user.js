const uuid = require('uuid');
const crypto = require('../crypto');
const teams = require('./teams');
const userDatabase = {};
//userID -> password

const registerUser = (userName, password) => {
  let hashedPwd = crypto.hashPasswordSync(password);
  //Guardar en la base de datos nuestro usuario
  let userId = uuid.v4();
  userDatabase[userId] = {
    userName: userName,
    password: hashedPwd
  }
  teams.bootstrapTeam(userId);
}

const getUser = (userId) => {
  return userDatabase[userId];
}

const getUserIdFromUserName = (userName) => {
  for (let user in userDatabase) {
    if (userDatabase[user].userName === userName) {
      let userData = userDatabase[user];
      userData.userId = user;
      return userData;
    }
  }
}

const checkUserCredentials = (userName, password, done) => {
  //comprobar que las credenciales son correctas
  let user = getUserIdFromUserName(userName)
  
  if (user) {
    crypto.comparePassword(password, user.password, done);
  } else {
    done('Missing user');
  }
}

exports.registerUser = registerUser;
exports.checkUserCredentials = checkUserCredentials;
exports.getUserIdFromUserName = getUserIdFromUserName;
exports.getUser = getUser;
