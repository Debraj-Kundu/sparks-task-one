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

mongoose.model('Transaction', transSchema);