const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  creation_date: {
    type: Date,
    default: Date.now,
  },
  last_login: {
    type: Date,
  },
  valid_account: {
    type: Boolean,
  },
  active: {
    type: Boolean,
  },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
