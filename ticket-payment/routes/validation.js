const express = require('express');
const router = express.Router();

const ticketsMiddleware = require('../middleware/tickets');
const usersMiddleware = require('../middleware/users');

/* VALIDATION */

/* POST validate tickets */
router.post('/tickets',
  usersMiddleware.getUserIdfromUUID,
  ticketsMiddleware.validateTickets,
);

/* POST validate vouchers */
router.post('/vouchers', (req, res) => res.sendStatus(200));

module.exports = router;
