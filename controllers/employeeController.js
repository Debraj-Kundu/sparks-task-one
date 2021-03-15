const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const Transaction = mongoose.model('Transaction');
const User = mongoose.model('User');

const multipleMongooseToObj = (arrayOfMongooseDocuments) => {
  const tempArray = [];
  if (arrayOfMongooseDocuments.length !== 0) {
    arrayOfMongooseDocuments.forEach(doc => tempArray.push(doc.toObject()));
  }
  return tempArray;
};

const mongooseToObj = (doc) => { if (doc == null) { return null; } return doc.toObject(); };

router.get('/userInfo/:id', async (req, res) => {
  try {
    const user = mongooseToObj(await Employee.findById(req.params.id)); // Returns the same as user.toObject()
    const users = multipleMongooseToObj(await Employee.find()); // Return arrays where .toObject() was called on each document
    //const employee = await Employee.findById(req.params.id);
    res.render('employee/userInfo', {
      viewTitle: 'User Info',
      employee: user
    });
  } catch (err) {
    console.log('Error: ' + err);
  }
});

router.get('/transaction', async (req, res) => {
  try {
    const users = multipleMongooseToObj(await Transaction.find()); //have to get from transactions db
    res.render('employee/transactions', {
      viewTitle: "Transactions",
      list: users
    });
  } catch (err) {
    console.log('Error: ' + err);
  }

});

router.get('/list', async (req, res) => {
  try {
    const user = mongooseToObj(await Employee.findOne({ email: req.body.email })); // Returns the same as user.toObject()
    const users = multipleMongooseToObj(await Employee.find()); // Return arrays where .toObject() was called on each document
    const userAmt = mongooseToObj(await User.findById('604f63d30f7dd67647116358'));
    res.render('employee/list', {
      list: users,
      balance: userAmt.amount
    });
  } catch (err) {
    console.log('Error: ' + err);
  }
});

router.get('/transfer/:id', async (req, res) => {
  try {
    const user = mongooseToObj(await Employee.findById(req.params.id)); // Returns the same as user.toObject()
    const users = multipleMongooseToObj(await Employee.find()); // Return arrays where .toObject() was called on each document
    //const employee = await Employee.findById(req.params.id);
    res.render('employee/transferAmount', {
      viewTitle: 'Transfer Amount',
      employee: user
    });
  } catch (err) {
    console.log('Error: ' + err);
  }
});

router.post('/', async (req, res) => {
  //console.log(req.body);
  await updateRecord(req, res);
});

async function insertRecord(req, res) {
  const e = await Employee.findById(req.body._id);
  let employee = new Transaction();
  employee.fullname = e.fullname;
  employee.amount = req.body.amount;
  employee.time = new Date();
  employee.save((err, doc) => {
    if (!err)
      res.redirect('employee/list');
    else
      console.log('Error during record insertion: ' + err);
  });
}

function isInt(value) {
  return !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10));
}

async function updateRecord(req, res) {
  let amt = await req.body.amount;
  const user = mongooseToObj(await Employee.findById(req.body._id));
  const userAmt = mongooseToObj(await User.findById('604f63d30f7dd67647116358'));
  let diff = +userAmt.amount - +amt;
  let add = +user.amount + +amt;
  //isNaN(parseInt(amt, 10))
  if (!isInt(amt)) {
    console.log('invalid number');
    await res.render('employee/transferAmount', {
      viewTitle: 'Transfer Amount',
      employee: user,
      msg: 'Enter a valid amount'
    });
  }

  else if (diff < 0) {
    console.log('Not enough funds');
    await res.render('employee/transferAmount', {
      viewTitle: 'Transfer Amount',
      employee: user,
      msg: 'Not Enough Funds'
    });
  }
  else {
    await User.findOneAndUpdate({ _id: '604f63d30f7dd67647116358' }, { amount: String(diff) }, { new: true }, (err, doc) => {
      if (err) {
        console.log('prb');
      }
    });
    await Employee.findOneAndUpdate({ _id: req.body._id }, { amount: String(add) }, { new: true }, (err, doc) => {
      if (!err) {
        //res.redirect('/employee/list');
        insertRecord(req, res);
      }
    });
  }
}

module.exports = router;