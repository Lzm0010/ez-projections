const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AssumptionTypeSchema = new Schema({
  name: {
    required: true,
    trim: true,
    minlength: 1,
    type: String,
  },
  _company: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

let AssumptionType = mongoose.model('AssumptionType', AssumptionTypeSchema);

module.exports = {AssumptionType};
