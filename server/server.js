//my config - ENV variables
require('./config/config');

//3rd party modules
const express = require('express');
const bodyParser = require('body-parser');

//my db connection module
const {mongoose} = require('./db/mongoose');

//my routes module
const routes = require('./routes/routes');

//express variables
const app = express();
const port = process.env.PORT;

//middleware for parsing application/json
app.use(bodyParser.json());

//my routes
routes(app);

//server connection
app.listen(port);

//export app for testing
module.exports = {app};
