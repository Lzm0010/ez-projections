//my config - ENV variables
require('./config/config');

//3rd party modules
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

//my db connection module
const {mongoose} = require('./db/mongoose');

//my model modules
const {User} = require('./models/user');
const {Company} = require('./models/company');
const {AssumptionType} = require('./models/assumption-type');
const {Assumption} = require('./models/assumption');
const {Product} = require('./models/product');

//my middleware modules
let {authenticate} = require('./middleware/authenticate');

//express variables
let app = express();
const port = process.env.PORT;

//middleware for parsing application/json
app.use(bodyParser.json());

//routes
//user routes
//create a user
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((err) => res.status(400).send(err));
});

//login
app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((err) => res.status(400).send(err));
});

//find myself
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

//logout
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, () => {
		res.status(400).send();
	});
});

//company routes
//create a company
app.post('/companies', authenticate, (req,res) => {
  let company = new Company ({
    name: req.body.name,
    _creator: req.user._id
  });

  company.save().then((comp) => {
    res.send(comp);
  }, (err) => {
    if (err) {
      res.status(400).send(err);
    }
  });

});

//get all companies associated w/ user
app.get('/companies', authenticate, (req,res) => {
  Company.find({_creator: req.user._id}).then((companies) => {
    res.send({companies});
  }, (err) => {
    return res.status(400).send(err);
  });
});

//get specific company
app.get('/companies/:id', authenticate, (req,res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Company.findOne(
    {
      _id: id,
      _creator: req.user._id
    }).then((comp) => {
      if(!comp) {
        return res.status(404).send();
      }

      res.send({comp});
    }).catch((err) => {
      res.status(400).send(err);
    });
});

//update company
app.patch('/companies/:id', authenticate, (req,res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['name']);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Company.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((comp) => {
    if (!comp) {
      return res.status(404).send();
    }

    res.send({comp});
  }).catch((err) => res.status(400).send(err));
});

//delete a company
app.delete('/companies/:id', authenticate, (req,res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Company.findOneAndRemove({_id: id, _creator: req.user._id}).then((comp) => {
    if(!comp) {
      return res.status(404).send();
    }
    res.send({comp});
  }).catch((err) => res.status(400).send(err));
});

//assumption-type routes
//create assumption type
app.post('/assumption-types', authenticate, (req,res) => {
  
});

//get assumption types
app.get('/assumption-types', authenticate, (req,res) => {

});

//update assumption type
app.patch('/assumption-types/:id', authenticate, (req,res) => {

});

//delete assumption type
app.delete('/assumption-types', authenticate, (req,res) => {

});

//assumption routes
//create assumption
app.post('/assumptions', authenticate, (req,res) => {

});

//get all assumptions associated w/ company
app.get('/assumptions', authenticate, (req,res) => {

});

//update assumption
app.patch('/assumptions/:id', authenticate, (req,res) => {

});

//delete assumption
app.delete('/assumptions/:id', authenticate, (req,res) => {

});

//product routes
//create a product
app.post('/products', authenticate, (req,res) => {

});

//get all products associated w/ company
app.get('/products', authenticate, (req,res) => {

});

//get specific product
app.get('/products/:id', authenticate, (req,res) => {

});

//update product
app.patch('/products/:id', authenticate, (req,res) => {

});

//delete product
app.delete('/products/:id', authenticate, (req,res) => {

});

//server connection
app.listen(port);

//export app for testing
module.exports = {app};
