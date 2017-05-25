const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RuleSchema = new Schema({
  name: {
    required: true,
    trim: true,
    minlength: 1,
    type: String
  },
  _type: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'AssumptionType'
  },
  rule: {
    required: true,
    type: String
  }
});

let Rule = mongoose.model('Rule', RuleSchema);

module.exports = {Rule};