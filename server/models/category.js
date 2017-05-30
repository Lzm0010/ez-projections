const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategorySchema = new Schema({
  name: {
    required: true,
    trim: true,
    minlength: 1,
    type: String
  },
  _company: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Company'
  }
});

CategorySchema.pre('remove',function(next) {
    this.model('Company').update(
        { },
        { "$pull": { "categories": this._id } },
        { "multi": true },
        next
    );
});

let Category = mongoose.model('Category', CategorySchema);

module.exports = {Category};
