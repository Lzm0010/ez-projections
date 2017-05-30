const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AssumptionSchema = new Schema({
  _category: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  _product: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Product'
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

AssumptionSchema.pre('remove',function(next) {
    this.model('Product').update(
        { },
        { "$pull": { "assumptions": this._id } },
        { "multi": true },
        next
    );
});

let Assumption = mongoose.model('Assumption', AssumptionSchema);

module.exports = {Assumption};
