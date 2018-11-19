const mongoose = require('mongoose');
const Promise = require('bluebird');
const vouchersMiddleware = require('./vouchers');
const transactionsModel = require('../database/schemas/transactions');
const vouchersModel = require('../database/schemas/vouchers');
const ordersModel = require('../database/schemas/orders');

exports.getUserTransactions = (req, res, next) => {
  transactionsModel.find({ 'user': req.userId })
    .then(transactions => res.status(200).json({ transactions }))
    .catch(err => res.status(500).json({ message: 'Error getting data from the database' }));
};

exports.createTransaction = (req, res, next) => {
  const user = mongoose.Types.ObjectId(req.payload.userId);
  const ticketsToBuy = req.payload.tickets;
  const showsInfo = req.payload.showsInfo;
  let totalTransaction = 0;
  const PRICE_INDEX = 1;

  for(let showName in ticketsToBuy)
    totalTransaction += showsInfo[showName][PRICE_INDEX] * parseInt(ticketsToBuy[showName][1]);

  req.payload.totalTransaction = totalTransaction;
  const transaction = { user: user, amount: totalTransaction , type: 'TICKETS'};
  console.log(transaction);
  const newTransaction = new transactionsModel(transaction);

  newTransaction.save(err => {
    if(err)
      return res.status(500).json({ message: 'Error creating transaction' });
    return next();
  });
};

/*
{
  "uuid": "",
  "order": {
    "coffee": "2",
    "drink": "3",
    "popcorn": "1",
    "sandwich": "1"
  },
  "vouchers": ["uuid1", "uuid2"]
}
*/
exports.createCafeteriaTransaction = (req, res, next) => {
  const order = req.payload.order;
  console.log({order});
  const user = mongoose.Types.ObjectId(req.payload.userId);
  console.log({user});
  const vouchers = req.payload.vouchers;
  let totalTransaction = 0;
  const promiseCalls = [];
  let orderString = "";

  for(let product in order){
    console.log({product});
    console.log(order[product]);
    const numberOfProduct = parseInt(order[product], 10);
    console.log(numberOfProduct);
    if(numberOfProduct != 0)
      orderString += product + ": " + numberOfProduct + " ";
    switch (product) {
      case 'coffee':
        totalTransaction += 1 * numberOfProduct;
        break;
      case 'drink':
        totalTransaction += 1 * numberOfProduct;
        break;
      case 'popcorn':
        totalTransaction += 3.5 * numberOfProduct;
        break;
      case 'sandwich':
        totalTransaction += 3.5 * numberOfProduct;
        break;
      default:
        break;
    }
  }
  console.log({totalTransaction});
  console.log({orderString});

  if(vouchers != null){
    vouchers.forEach(uuid => {
      promiseCalls.push(vouchersMiddleware.getVoucherType(uuid));
    });

    Promise.all(promiseCalls).then(results => {
      results.forEach(voucherType => {
        switch (voucherType) {
          case 'FOOD':
            totalTransaction -= 3.5;
            break;
          case 'DRINK':
            totalTransaction -= 1;
            break;
          case 'FIVEPERCENTE':
            totalTransaction = totalTransaction * 0.95;
            break;
          default:
            break;
        }
      });
      console.log({totalTransactionAfter: totalTransaction});

      const transaction = { user: user, amount: totalTransaction , type: 'CAFETERIA'};
      const newTransaction = new transactionsModel(transaction);
      newTransaction.save(err => {
        console.log(err);
        if(err)
          return res.status(500).json({ message: 'Error creating transaction' });

        const order = { user: user, order: orderString, total: totalTransaction };
        const newOrder = new ordersModel(order);
        newOrder.save(err => {
          if(err)
            return res.status(500).json({ message: 'Error creating order' });
          return res.sendStatus(204);s
        });
      });
    });
  } else {
    const transaction = { user: user, amount: totalTransaction , type: 'CAFETERIA'};
    const newTransaction = new transactionsModel(transaction);
    newTransaction.save(err => {
      console.log(err);
      if(err)
        return res.status(500).json({ message: 'Error creating transaction' });
      const order = { user: user, order: orderString, total: totalTransaction };
      const newOrder = new ordersModel(order);
      newOrder.save(err => {
        if(err)
          return res.status(500).json({ message: 'Error creating order' });
        return res.sendStatus(204);
      });
    });
  }
};
