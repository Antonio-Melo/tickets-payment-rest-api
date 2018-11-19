const express = require('express');
const router = express.Router();

const ticketsMiddleware = require('../middleware/tickets');
const vouchersMiddleware = require('../middleware/vouchers');
const usersMiddleware = require('../middleware/users');
const ordersMiddleware = require('../middleware/order');

/* VALIDATION */

/* POST validate tickets */
router.post('/tickets',
  usersMiddleware.getUserIdfromUUID,
  ticketsMiddleware.validateTickets);

/* POST validate vouchers */
router.post('/vouchers',
  usersMiddleware.getUserIdfromUUID,
  vouchersMiddleware.validateVouchers);

router.post('/order',
  ordersMiddleware.validateOrder);

module.exports = router;
