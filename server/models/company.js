const mongoose = require('mongoose');
let Schema = mongoose.Schema;

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
    type: mongoose.Schema.Types.ObjectId
  }
});

let Company = mongoose.model('Company', CompanySchema);

module.exports = {Company};
