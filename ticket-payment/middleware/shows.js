const showsModel = require('../database/schemas/shows');

exports.getAvailableShows = (req, res, next) => {
  showsModel.find().where('date').gt(Date.now())
    .then(resp => {
      return res.status(200).json(resp);
    })
    .catch(err => res.status(500).json({ message: 'Error getting data from the database' }));
};
