const mongoose = require('mongoose');

const vouchersSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId, ref: 'user',
    required: true
  }
});

const vouchersModel = mongoose.model('voucher', vouchersSchema);
module.exports = vouchersModel;
