const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
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

//CANT GET TO WORK, SEE IF IT CAN BE HANDLED IN REACT
// CompanySchema.pre('save', function(next) {
//   const Category = mongoose.model('Category');
//
//   const company = this;
//
//   const categories = [{
// 		_id: new ObjectID(),
// 		name: "Inventory",
// 		_company: company._id
// 	},
// 	{
// 		_id: new ObjectID(),
// 		name: "Sales",
// 		_company: company._id
// 	},
// 	{
// 		_id: new ObjectID(),
// 		name: "Cost",
// 		_company: company._id
// 	},
// 	{
// 		_id: new ObjectID(),
// 		name: "Fixed",
// 		_company: company._id
// 	},
// 	{
// 		_id: new ObjectID(),
// 		name: "Employee",
// 		_company: company._id
// 	},
// 	{
// 		_id: new ObjectID(),
// 		name: "Demand",
// 		_company: company._id
// 	}];
//
//   if (company.isNew) {
//     Category.create(categories)
//     .then((categories) => {
//
//       console.log(categories, company.typeOf());
//       // company.categories.concat(categories);
//       next();
//     });
//   }
// });

// CompanySchema.pre('save', function(next) {
//   const Product = mongoose.model('Product');
//   const company = this;
//
//   const product = {
//     _id: new ObjectID(),
// 		name: "Test Product",
// 		_company: company._id,
// 		assumptions: []
//   };
//
//   if (company.isNew) {
//     Product.create(product)
//     .then((product) => {
//       //this isnt pushing to products
//       company.products.concat(product);
//       next();
//     });
//   }
// });
//COME BACK TO COMPANY & populate rules? RETHINK RULES???

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
