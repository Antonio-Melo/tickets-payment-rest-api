const mongoose = require('mongoose');

const ticketsSchema = mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, ref: 'user',
    required: true
  },
  show: {
    type: mongoose.Schema.Types.ObjectId, ref: 'show',
    required: true
  },
  validated: {
    type: Boolean,
    default: false
  }
});

const ticketsModel = mongoose.model('ticket', ticketsSchema);
module.exports = ticketsModel;
