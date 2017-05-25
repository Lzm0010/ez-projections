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
const {Category} = require('./models/category');
const {Rule} = require('./models/rule');
const {Product} = require('./models/product');
const {Assumption} = require('./models/assumption');

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

// category routes
// create category for a company
app.post('/companies/:id/categories', authenticate, (req,res) => {
  let compId = req.params.id;
  let category = new Category({
    name: req.body.name
  });

  if (!ObjectID.isValid(compId)){
    return res.status(404).send();
  }

  Company.findOne(
    {
      _id: compId,
      _creator: req.user._id
    }).then((comp) => {
      if(!comp) {
        return res.status(404).send();
      }

      category.save().then((category) => {
        comp.categories.push(category);
        comp.save().then(comp => {
          res.send(comp);
        }), (err) => {
          if (err) {
            res.status(400).send(err);
          }
        }
      }, (err) => {
        if (err) {
          res.status(400).send(err);
        }
      });
    }).catch((err) => {
      res.status(400).send(err);
    });
});

//get all categories for company
app.get('/companies/:id/categories', authenticate, (req,res) => {

});

//update category
app.patch('/companies/:id/categories/:id', authenticate, (req,res) => {

});

//delete category
app.delete('/companies/:id/categories/:id', authenticate, (req,res) => {

});

//product routes
//create a product
app.post('/companies/:id/products', authenticate, (req,res) => {

});

//get all products associated w/ company
app.get('/companies/:id/products', authenticate, (req,res) => {

});

//get specific product
app.get('/companies/:id/products/:id', authenticate, (req,res) => {

});

//update product
app.patch('/companies/:id/products/:id', authenticate, (req,res) => {

});

//delete product
app.delete('/companies/:id/products/:id', authenticate, (req,res) => {

});

//rule routes
//create a rule
app.post('/companies/:id/rules', authenticate, (req,res) => {

});

//get all rules associated w/ company
app.get('/companies/:id/rules', authenticate, (req,res) => {

});

//update rule
app.patch('/companies/:id/rules/:id', authenticate, (req,res) => {

});

//delete rule
app.delete('/companies/:id/rules/:id', authenticate, (req,res) => {

});

//assumption routes
//create assumption
app.post('/companies/:id/products/:id/assumptions', authenticate, (req,res) => {

});

//get all assumptions associated w/ product
app.get('/companies/:id/products/:id/assumptions', authenticate, (req,res) => {

});

//update assumption
app.patch('/companies/:id/products/:id/assumptions/:id', authenticate, (req,res) => {

});

//delete assumption
app.delete('/companies/:id/products/:id/assumptions/:id', authenticate, (req,res) => {

});

//server connection
app.listen(port);

//export app for testing
module.exports = {app};
