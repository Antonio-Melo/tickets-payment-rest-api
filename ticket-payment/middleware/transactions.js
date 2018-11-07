const transactionsModel = require('../database/schemas/transactions');

exports.getUserTransactions = (req, res, next) => {
  console.log(req.userId);
  transactionsModel.find({ 'user': req.userId })
    .then(transactions => res.status(200).json({ transactions }));
}
