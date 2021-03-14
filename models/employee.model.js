const mongoose = require('mongoose');

let employeeSchema = new mongoose.Schema({
  fullname: {
    type: String,
    default: true
  },
  email: {
    type: String,
    default: true
  },
  amount: {
    type: String,
    default: true
  },
  address: {
    type: String,
    default: true
  }
});

mongoose.model('Employee', employeeSchema);