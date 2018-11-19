const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'user',
    required: true
  },
  order: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  validated: {
    type: Boolean,
    default: false
  }
});

const ordersModel = mongoose.model('order', ordersSchema);
module.exports = ordersModel;
