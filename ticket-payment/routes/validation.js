const express = require('express');
const router = express.Router();

const ticketsMiddleware = require('../middleware/tickets');
const vouchersMiddleware = require('../middleware/vouchers');
const usersMiddleware = require('../middleware/users');

/* VALIDATION */

/* POST validate tickets */
router.post('/tickets',
  usersMiddleware.getUserIdfromUUID,
  ticketsMiddleware.validateTickets);

/* POST validate vouchers */
router.post('/vouchers',
  usersMiddleware.getUserIdfromUUID,
  vouchersMiddleware.validateVouchers);

module.exports = router;
