let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productSchema = new Schema({
  name: {
    required: true,
    trim: true,
    type: String,
    minlength: 1,
  },
  _company: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  assumptions: [
    {
      name: {
        required: true,
        type: String
      },
      value: {
        required: true
      }
    }
  ]
});

let Product = mongoose.model('Product', productSchema);

module.exports = {Product};
