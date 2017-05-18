//my config - ENV variables
require('./config/config');

//3rd party modules
const express = require('express');

//my db connection modules
const {mongoose} = require('./db/mongoose');

//my model modules
//COME BACK TBD

let app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('We up in dis b!');
});

app.listen(port);
