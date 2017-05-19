//my config - ENV variables
require('./config/config');

//3rd party modules
const express = require('express');

//my db connection modules
const {mongoose} = require('./db/mongoose');

//my model modules
const {User} = require('./models/user');
const {Company} = require('./models/company');
const {AssumptionType} = require('./models/assumption-type');
const {Assumption} = require('./models/assumption');
const {Product} = require('./models/product');

//express variables
let app = express();
const port = process.env.PORT;

//routes
app.get('/', (req, res) => {
  res.send('We up in dis b!');
});

//server connection
app.listen(port);
