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

Company.methods.removeCategory = function(category) {
  let company = this;

  return company.update({
    $pull: {
      categories: {
        category
      }
    }
  });
}
// CompanySchema.pre('remove', function(next) {
//   const Category = mongoose.model('Category');
//
//   Category.remove({_id: {$in: this.categories }})
//   .then(() => next());
// });
// const Product = mongoose.model('Product');
// const Rule = mongoose.model('Rule');
// let allProducts = Product.remove({_id: {$in: this.products }});
// let allRules = Rule.remove({_id: {$in: this.rules }});

let Company = mongoose.model('Company', CompanySchema);

module.exports = {Company};
