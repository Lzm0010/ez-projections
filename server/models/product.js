const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
  name: {
    required: true,
    trim: true,
    type: String,
    minlength: 1
  },
  _company: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  assumptions:[{
    type: Schema.Types.ObjectId,
    ref: 'Assumption'
  }]
});

// ProductSchema.pre('save', function(next) {
//   const Assumption = mongoose.model('Assumption');
//   const product = this;
//
//   const assumptions = [
//     {
//       _id: new ObjectID(),
//       _product: product._id,
//       _category: "insert",
//   		name: "insert",
//   		valueType: "insert",
//   		value: 111
//     },
//     {
//       //add assumptions
//     }
//   ];
//
//   if (product.isNew) {
//     Assumption.create(assumptions)
//     .then((assumptions) => {
//       //this isnt pushing to products
//       product.assumptions.concat(assumptions);
//       next();
//     });
//   }
// });

ProductSchema.pre('remove',function(next) {
    this.model('Company').update(
        { },
        { "$pull": { "products": this._id } },
        { "multi": true },
        next
    );
});

ProductSchema.pre('remove', function(next) {
  const Assumption = mongoose.model('Assumption');

  Assumption.remove({_id: {$in: this.assumptions}})
  .then(() => next());
});

let Product = mongoose.model('Product', ProductSchema);

module.exports = {Product};
