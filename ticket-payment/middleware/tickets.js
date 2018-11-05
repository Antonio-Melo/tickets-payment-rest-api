const ticketsModel = require('../database/schemas/tickets');

exports.getUserTickets = (req, res, next) => {
  ticketsModel.find({ 'owner': req.userId })
    .then(tickets => res.status(200).json({ tickets }));
};
