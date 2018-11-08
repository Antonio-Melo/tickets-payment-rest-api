const mongoose = require('mongoose');

const vouchersSchema = mongoose.Schema({
  uuid:{
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, ref: 'user',
    required: true
  },
  type: {
    type: String,
    enum: ['POPCORN', 'DRINK', 'FIVEPERCENTE']
  },
  validated: {
    type: Boolean,
    default: false
  }
});

const vouchersModel = mongoose.model('voucher', vouchersSchema);
module.exports = vouchersModel;
