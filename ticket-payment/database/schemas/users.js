const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  nif: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  creditCard: {
    number: {
      type: Number,
      required: true
    },
    cvv: {
      type: Number,
      required: true
    },
    validity:{
      type: Date,
      required: true
    }
  },
  updated_at: { type: Date, default: Date.now }
}, { collection: 'users' });

const usersModel = mongoose.model('user', usersSchema);
module.exports = usersModel;
