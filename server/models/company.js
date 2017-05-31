const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CompanySchema = new Schema({
  name: {
    required: true,
    trim: true,
    minlength: 1,
    type: String,
    unique: true
  },
  _creator: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  categories:[{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  products:[{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  rules:[{
    type: Schema.Types.ObjectId,
    ref: 'Rule'
  }]
});

CompanySchema.pre('remove', function(next) {
  const Category = mongoose.model('Category');
  const Product = mongoose.model('Product');
  const Rule = mongoose.model('Rule');

  Category.remove({_id: {$in: this.categories }})
  .then(() => Product.remove({_id: {$in: this.products }})
  .then(() => Rule.remove({_id: {$in: this.rules }})))
  .then(() => next());
});

let Company = mongoose.model('Company', CompanySchema);

module.exports = {Company};
