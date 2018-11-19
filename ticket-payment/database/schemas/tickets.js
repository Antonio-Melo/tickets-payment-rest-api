const mongoose = require('mongoose');

const ticketsSchema = mongoose.Schema({
  uuid: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: false
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
