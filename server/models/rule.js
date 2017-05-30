const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RuleSchema = new Schema({
  name: {
    required: true,
    trim: true,
    minlength: 1,
    type: String
  },
  _category: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  _company: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  rule: {
    required: true,
    type: String
  }
});

RuleSchema.pre('remove',function(next) {
    this.model('Company').update(
        { },
        { "$pull": { "rules": this._id } },
        { "multi": true },
        next
    );
});

let Rule = mongoose.model('Rule', RuleSchema);

module.exports = {Rule};
