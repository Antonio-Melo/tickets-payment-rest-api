const express = require('express');
const router = express.Router();
const showsMiddleware = require('../middleware/shows');

/* GET available shows*/
router.get('/', showsMiddleware.getAvailableShows);

module.exports = router;
