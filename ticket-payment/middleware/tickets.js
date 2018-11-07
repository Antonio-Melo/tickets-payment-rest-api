const mongoose = require('mongoose');
const Promise = require('bluebird');

const ticketsModel = require('../database/schemas/tickets');
const showsModel = require('../database/schemas/shows');

const INDEX_NAME = 0;

exports.getUserTickets = (req, res, next) => {
  ticketsModel.find({ 'owner': req.userId })
    .then(tickets => res.status(200).json({ tickets }));
};

exports.buyTicket = (show, user) => new Promise((resolve, reject) => {
  const ticket = { owner: user, show: show };
  const newTicket = new ticketsModel(ticket);

  newTicket.save(err => {
    if(err)
      return reject();
    return resolve();
  });
});

exports.buyTickets = (req, res, next) => {
  const user = mongoose.Types.ObjectId(req.userId);
  const ticketsToBuy = req.body.ticketsToBuy;

  /* Verifies is shows exist */
  let shows = [];
  for(let showName in ticketsToBuy)
    shows.push(showName);

  showsModel.find({
    'name': { $in: shows }
  }).then(results => {
    if(results.length !== shows.length)
      return res.status(500).json({ message: 'Error: shows not valid' });

    let showsIds = {};
    for(show of results)
      showsIds[show.name] = show._id;

    /* Creates promises to buy a individual ticket */
    let promiseCalls = [];
    for (let showName in ticketsToBuy) {
      const showNumberOfTickets = parseInt(ticketsToBuy[showName]);
      const showId = showsIds[showName];
      for(let i = 0; i < showNumberOfTickets; i++)
        promiseCalls.push(this.buyTicket(showId, user));
    }
    /* Runs promises and waits for confirmation of all */
    return Promise.all(promiseCalls).then(results => {
      return res.sendStatus(204);
    }).catch(error => res.status(500).json({ message: 'Error buying tickets' }));
  });
};
