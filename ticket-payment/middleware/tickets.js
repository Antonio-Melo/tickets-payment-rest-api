const mongoose = require('mongoose');
const Promise = require('bluebird');
const uuidv4 = require('uuid/v4');

const ticketsModel = require('../database/schemas/tickets');
const showsModel = require('../database/schemas/shows');
const showsMiddleware = require('./shows');

const INDEX_ID = 0;
const INDEX_NR_TICKETS = 1;
const INDEX_DATE = 0;

exports.getUserTickets = (req, res, next) => {
  const userId = req.userId;

  ticketsModel.find({ 'owner': req.userId }, 'show -_id')
    .then(tickets => {
      let showsIds = [];
      let uniqueShowsIds = [];
      let promiseCalls = [];
      
      tickets.forEach(showJson => showsIds.push(showJson.show))
      uniqueShowsIds = Array.from(new Set(showsIds));
      uniqueShowsIds.forEach(showId => promiseCalls.push(showsMiddleware.getShowAndUserTickets(showId, userId)));

      Promise.all(promiseCalls).then(results => {
        console.log(results);
        return res.status(200).json({ shows: results});
      }).catch(err => res.status(500).json({ message: 'Error getting tickets' }));
    }).catch(err => res.status(500).json({ message:  `Error getting data from the database: ${err}` }));
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
  let dates = [];
  for(let showName in ticketsToBuy){
    shows.push(showName);
    dates.push(ticketsToBuy[showName][INDEX_DATE]);
  }

  showsModel.find({
    'name': { $in: shows },
    'date': { $in: dates }
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
      const showNumberOfTickets = parseInt(ticketsToBuy[showName][INDEX_NR_TICKETS]);
      totalNumberOfTickets += showNumberOfTickets;
      const showId = showsInfo[showName][INDEX_ID];
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

exports.validateTicket = (user, ticketUUID) => new Promise((resolve, reject) => {
  const userID = mongoose.Types.ObjectId(user);
  ticketsModel.findOneAndUpdate({ uuid: ticketUUID, owner: userID, validated: false }, { validated: true})
  .then(ticket => resolve())
  .catch(err => reject());
});

exports.validateTickets = (req, res, next) => {
  const userID = req.userId;
  const ticketToValidate = req.body.tickets;

  let promiseCalls = [];

  for(let i = 0; i < ticketToValidate.length; i++)
    promiseCalls.push(this.validateTicket(userID, ticketToValidate[i]));

  return Promise.all(promiseCalls).then(results => {
    return res.sendStatus(204);
  }).catch(error => res.status(500).json({ messsage: 'Error validating tickets' }));
};
