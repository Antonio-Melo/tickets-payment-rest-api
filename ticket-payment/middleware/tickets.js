const mongoose = require('mongoose');
const Promise = require('bluebird');
const uuidv4 = require('uuid/v4');

const ticketsModel = require('../database/schemas/tickets');
const showsModel = require('../database/schemas/shows');

const INDEX_NAME = 0;

exports.getUserTickets = (req, res, next) => {
  ticketsModel.find({ 'owner': req.userId })
    .then(tickets => res.status(200).json({ tickets }))
    .catch(err => res.status(500).json({ message: 'Error getting data from the database' }));
};

exports.buyTicket = (show, user) => new Promise((resolve, reject) => {
  const ticketUUID = uuidv4();
  const ticket = { owner: user, show: show, uuid: ticketUUID };
  const newTicket = new ticketsModel(ticket);

  newTicket.save(err => {
    if(err)
      return reject();
    return resolve();
  });
});

exports.buyTickets = (req, res, next) => {
  const user = mongoose.Types.ObjectId(req.payload.userId);
  const ticketsToBuy = req.payload.tickets;

  /* Verifies is shows exist */
  let shows = [];
  for(let showName in ticketsToBuy)
    shows.push(showName);

  showsModel.find({
    'name': { $in: shows }
  }).then(results => {
    if(results.length !== shows.length)
      return res.status(500).json({ message: 'Error: shows not valid' });

    let showsInfo = {};
    for(show of results)
      showsInfo[show.name] = [show._id, show.price];

    /* Creates promises to buy a individual ticket */
    let promiseCalls = [];
    let totalNumberOfTickets = 0;

    for (let showName in ticketsToBuy) {
      const showNumberOfTickets = parseInt(ticketsToBuy[showName]);
      totalNumberOfTickets += showNumberOfTickets;
      const showId = showsInfo[showName][INDEX_NAME];
      for(let i = 0; i < showNumberOfTickets; i++)
        promiseCalls.push(this.buyTicket(showId, user));
    }
    req.payload.totalNumberOfTickets = totalNumberOfTickets;
    req.payload.showsInfo = showsInfo;
    
    /* Runs promises and waits for confirmation of all */
    return Promise.all(promiseCalls).then(results => {
      return next();
    }).catch(error => res.status(500).json({ message: 'Error buying tickets' }));
  }).catch(err => res.status(500).json({ message: 'Error getting data from the database' }));
};
