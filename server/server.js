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
	}).catch( err => res.status(400).send(err));
});

//login
app.post('/users/login', (req, res) => {

});

//find myself
app.get('/users/me', (req, res) => {

});

//logout
app.delete('/users/me/token', (req, res) => {

});

//company routes
//create a company
app.post('/companies', (req,res) => {

});

//get all companies associated w/ user
app.get('/companies', (req,res) => {

});

//get specific company
app.get('/companies/:id', (req,res) => {

});

//update company
app.patch('/companies/:id', (req,res) => {

});

//delete a company
app.delete('/companies/:id', (req,res) => {

});

//assumption-type routes
//create assumption type
app.post('/assumption-types', (req,res) => {

});

//get assumption types
app.get('/assumption-types', (req,res) => {

});

//update assumption type
app.patch('/assumption-types/:id', (req,res) => {

});

//delete assumption type
app.delete('/assumption-types', (req,res) => {

});

//assumption routes
//create assumption
app.post('/assumptions', (req,res) => {

});

//get all assumptions associated w/ company
app.get('/assumptions', (req,res) => {

});

//update assumption
app.patch('/assumptions/:id', (req,res) => {

});

//delete assumption
app.delete('/assumptions/:id', (req,res) => {

});

//product routes
//create a product
app.post('/products', (req,res) => {

});

//get all products associated w/ company
app.get('/products', (req,res) => {

});

//get specific product
app.get('/products/:id', (req,res) => {

});

//update product
app.patch('/products/:id', (req,res) => {

});

//delete product
app.delete('/products/:id', (req,res) => {

});

//server connection
app.listen(port);

//export app for testing
module.exports = {app};
