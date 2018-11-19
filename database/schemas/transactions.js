const mongoose = require('mongoose');

const transactionsSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'user',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['TICKETS', 'CAFETERIA'],
    required: true
  },
});

const transactionsModel = mongoose.model('transaction', transactionsSchema);
module.exports = transactionsModel;
