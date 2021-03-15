const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    default: true
  },
  amount: {
    type: String,
    default: true
  }
});

mongoose.model('User', userSchema);