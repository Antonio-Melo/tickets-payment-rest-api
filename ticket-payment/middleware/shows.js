const Promise = require('bluebird');
const showsModel = require('../database/schemas/shows');
const ticketsModel = require('../database/schemas/tickets');

exports.getAvailableShows = (req, res, next) => {
  showsModel.find().where('date').gt(Date.now())
    .then(resp => {
      return res.status(200).json(resp);
    })
    .catch(err => res.status(500).json({ message: 'Error getting data from the database' }));
};

exports.getShowAndUserTickets = (showId, userId) => new Promise((resolve) => {
  const showAndTickets = {};
  showsModel.findById(showId).then(show => {
    showAndTickets.showId = show.id;
    showAndTickets.showName = show.name;
    showAndTickets.artist = show.artist;
    showAndTickets.date = show.date;
    showAndTickets.price = show.price;

    ticketsModel.find({ owner: userId, show: showId}, 'uuid -_id').then(tickets => {
      showAndTickets.nrTickets = tickets.length;
      showAndTickets.tickets = tickets;
      return resolve(showAndTickets);
    }).catch(err => res.status(500).json({ message: 'Error getting data from the database 3' }));
  }).catch(err => res.status(500).json({ message: 'Error getting data from the database 2' }));
});
