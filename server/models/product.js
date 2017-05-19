let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ProductSchema = new Schema({
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
        required: true,
        type: String
      }
    }
  ]
});

let Product = mongoose.model('Product', ProductSchema);

module.exports = {Product};
