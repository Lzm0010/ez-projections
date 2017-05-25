const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
  name: {
    required: true,
    trim: true,
    type: String,
    minlength: 1
  },
  assumptionTypes:[{
    type: Schema.Types.ObjectId,
    ref: 'AssumptionType'
  }],
  assumptions: [{
    type: Schema.Types.ObjectId,
    ref: 'Assumption'
  }]
});

let Product = mongoose.model('Product', ProductSchema);

module.exports = {Product};
