const uuidv4 = require('uuid/v4');
const mongoose = require('mongoose');
const vouchersModel = require('../database/schemas/vouchers');

exports.getUserVouchers = (req, res, next) => {
  vouchersModel.find({ 'owner': req.userId })
    .then(vouchers => res.status(200).json({ vouchers }));
}

exports.generateVoucher = payload => new Promise((resolve, reject) => {
  const voucherUUID = uuidv4();
  const type = (Math.random() < 0.5 ? "DRINK" : "POPCORN");
  const user = mongoose.Types.ObjectId(payload.userId);
  const voucher = {
    uuid: voucherUUID,
    type: type,
    owner: user
  };

  const newVoucher = new vouchersModel(voucher);
  newVoucher.save(err => {
    if(err)
      return reject();
    return resolve();
  });
});

exports.generateSpecialVoucher = (req, res, next) => {
  if(req.payload.totalTransaction > 100){
    const voucherUUID = uuidv4();
    const type = "FIVEPERCENTE";
    const user = mongoose.Types.ObjectId(req.payload.userId);
    const voucher = {
      uuid: voucherUUID,
      type: type,
      owner: user
    };

    const newVoucher = new vouchersModel(voucher);
    newVoucher.save(err => {
      if(err)
        return res.status(500).json({ message: 'Erro creatin special voucher'});
      return res.sendStatus(204);
    });
  }else return res.sendStatus(204);
};

exports.generateVouchers = (req, res, next) => {
 const totalNumberOfTickets = req.payload.totalNumberOfTickets;
 const promiseCalls = [];

 for(let i = 0; i < totalNumberOfTickets; i++)
  promiseCalls.push(this.generateVoucher(req.payload));

 return Promise.all(promiseCalls).then(results => {
   return next();
 }).catch(err => res.status(500).json({ message: 'Error creating vouchers' }));
};
