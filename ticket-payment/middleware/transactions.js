const mongoose = require('mongoose');
const transactionsModel = require('../database/schemas/transactions');
const vouchersModel = require('../database/schemas/vouchers');

exports.getUserTransactions = (req, res, next) => {
  transactionsModel.find({ 'user': req.userId })
    .then(transactions => res.status(200).json({ transactions }));
};

exports.createTransaction = (req, res, next) => {
  const user = mongoose.Types.ObjectId(req.payload.userId);
  const ticketsToBuy = req.payload.tickets;
  const showsInfo = req.payload.showsInfo;
  let totalTransaction = 0;
  const PRICE_INDEX = 1;

  for(let showName in ticketsToBuy)
    totalTransaction += showsInfo[showName][PRICE_INDEX] * parseInt(ticketsToBuy[showName]);

  req.payload.totalTransaction = totalTransaction;
  const transaction = { user: user, amount: totalTransaction };
  const newTransaction = new transactionsModel(transaction);

  newTransaction.save(err => {
    if(err)
      return res.status(500).json({ message: 'Error creating transaction' });
    return next();
  })
};
