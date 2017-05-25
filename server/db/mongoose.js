const mongoose = require('mongoose');

//use this promise library (es6 promises over bluebird or q or axios)
mongoose.Promise = global.Promise;
//choose to connect to db based on environment
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};
