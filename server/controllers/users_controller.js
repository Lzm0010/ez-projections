//USERS CONTROLLER
//my 3rd party modules
const _ = require('lodash');

//user model
const {User} = require('./../models/user');

module.exports = {
  //create new user
  create(req, res) {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((err) => res.status(400).send(err));
  },
  //login
  login(req, res) {
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
    }).catch((err) => res.status(400).send(err));
  },
  //find myself
  findMe(req, res) {
    res.send(req.user);
  },
  //logout
  logout(req, res){
    req.user.removeToken(req.token).then(() => {
      res.status(200).send();
    }, () => {
      res.status(400).send();
    });
  }
};
