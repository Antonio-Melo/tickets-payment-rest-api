const express = require('express');
const router = express.Router();

/* GET available shows*/
router.get('/', (req, res) => res.sendStatus(200));

module.exports = router;
