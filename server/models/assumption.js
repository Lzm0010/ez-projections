let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let assumptionSchema = new Schema({
  _company: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  _type: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
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
  rules: [
    {
      page: {
        required: true,
        type: String
      },
      rule: {
        required: true
      }
    }
  ]
});

let Assumption = mongoose.model('Assumption', assumptionSchema);

module.exports = {Assumption};