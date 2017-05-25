const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AssumptionSchema = new Schema({
  _category: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  name: {
    required: true,
    trim: true,
    minlength: 1,
    type: String,
  },
  valueType: {
    required: true,
    type: String,
    enum: ['Currency', 'Date', 'Number', 'Percentage']
  },
  value: {
    type: Number
  }
});

let Assumption = mongoose.model('Assumption', AssumptionSchema);

module.exports = {Assumption};
