const mongoose = require('mongoose');

let transSchema = new mongoose.Schema({
  fullname: {
    type: String,
    default: true
  },
  amount: {
    type: String,
    default: true
  },
  time: {
    type: Date,
    default: true
  }
});

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
  },
  transaction: [transSchema]
});

mongoose.model('Employee', employeeSchema);