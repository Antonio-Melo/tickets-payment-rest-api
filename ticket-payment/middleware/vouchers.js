const vouchersModel = require('../database/schemas/vouchers');

exports.getUserVouchers = (req, res, next) => {
  vouchersModel.find({ 'owner': req.userId })
    .then(vouchers => res.status(200).json({ vouchers }));
}
