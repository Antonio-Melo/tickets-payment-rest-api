const ticketsModel = require('../database/schemas/tickets');

exports.getUserTickets = (req, res, next) => {
  ticketsModel.find({ 'owner': req.userId })
    .then(tickets => res.status(200).json({ tickets }));
};

exports.buyTickets = (req, res, next) => {
  const userId = req.userId;
  const tickets = req.body.ticketsToBuy;
};
