const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
  name: {
    required: true,
    trim: true,
    type: String,
    minlength: 1
  },
  assumptions:[{
    type: Schema.Types.ObjectId,
    ref: 'Assumption'
  }]
});

ProductSchema.pre('remove', function(next) {
  const Assumption = mongoose.model('Assumption');

  Assumption.remove({_id: {$in: this.assumptions}})
  .then(() => next());
});

let Product = mongoose.model('Product', ProductSchema);

module.exports = {Product};
