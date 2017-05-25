const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AssumptionTypeSchema = new Schema({
  name: {
    required: true,
    trim: true,
    minlength: 1,
    type: String
  }
});

let AssumptionType = mongoose.model('AssumptionType', AssumptionTypeSchema);

module.exports = {AssumptionType};
