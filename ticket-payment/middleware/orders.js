const ordersModel = require('../database/schemas/orders');

exports.getOrders = (req, res, next) => {
  ordersModel.find({ validated: false}).then(orders => {
    if(orders)
      return res.status(200).json({ orders });
  });
};

exports.validateOrder = (req, res, next) => {
  ordersModel.find({ _id: req.orderId}).then(order => {
    order.validated = true;
    order.save(err => {
      if(err)
        return res.status(500).json({ message: 'Error validating order' });
      return res.status(200).json({ message: 'Success validating order' });
    })
  });
};
