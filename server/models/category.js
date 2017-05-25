const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategorySchema = new Schema({
  name: {
    required: true,
    trim: true,
    minlength: 1,
    type: String
  }
});

let Category = mongoose.model('Category', CategorySchema);

module.exports = {Category};
