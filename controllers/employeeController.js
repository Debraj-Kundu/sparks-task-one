const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const Transaction = mongoose.model('Transaction');

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
    res.render('employee/list', {
      list: users
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

async function updateRecord(req, res) {
  const amt = await req.body.amount;
  const user = mongooseToObj(await Employee.findById(req.body._id));
  //console.log(typeof (req.body.amount));
  if (amt > 10000) {
    if (!amt) {
      await res.render('employee/transferAmount', {
        viewTitle: 'Transfer Amount',
        employee: user,
        msg: 'Enter some amount'
      });
    } else {
      console.log('Not enough funds');
      await res.render('employee/transferAmount', {
        viewTitle: 'Transfer Amount',
        employee: user,
        msg: 'Not Enough Funds'
      });
    }
  }
  else {
    await Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
      if (!err) {
        //res.redirect('/employee/list');
        insertRecord(req, res);
      }
    });
  }
}

module.exports = router;