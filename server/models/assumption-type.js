const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let assumptionTypeSchema = new Schema({
  name: {
    required: true,
    trim: true,
    minlength: 1,
    type: String,
  }
});

let AssumptionType = mongoose.model('AssumptionType', assumptionTypeSchema);

module.exports = {AssumptionType};
