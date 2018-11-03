const mongoose = require('mongoose');

const showsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lotation: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

const showsModel = mongoose.model('show', showsSchema);
module.exports = showsModel;
