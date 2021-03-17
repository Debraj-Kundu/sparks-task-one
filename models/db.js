const mongoose = require('mongoose');

const str = 'mongodb://localhost:27017/EmployeeDB1';

const uri = process.env.ATLAS_URI || str;
//mongoose.createConnection(str, { useNewUrlParser: true, useUnifiedTopology: true });

async function callDB() {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => {
    if (!err) { console.log('MongoDB connection success'); }
    else { console.log('MongoDB connection error: ' + err); }
  });
}

callDB();

require('./employee.model');
require('./trans.model');
require('./user.model');