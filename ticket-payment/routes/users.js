const express = require('express');
const router = express.Router();
const passport = require('../auth/passport');
const usersMiddleware = require('../middleware/users');
const ticketsMiddleware = require('../middleware/tickets');
const vouchersMiddleware = require('../middleware/vouchers');
const transactionsMiddleware = require('../middleware/transactions');

/* USER ROUTES */
/* TODO
  -Remove crypto(Deprecated) and change to crypto-js
*/

/* GET Sign up user */
router.post('/signup',
  usersMiddleware.checkIfUserAlreadyExists,
  usersMiddleware.validateUserData,
  usersMiddleware.generateUUID,
  usersMiddleware.registerUserInDB);

/* POST Sign in user */
router.post('/signin', (req, res, next) => passport.authenticate('local',
  (err, user) => {
    if (err || !user)
      return res.sendStatus(403);
    req.user = user;
    return usersMiddleware.saveNewPublicKey(req, res, next);
  })(req, res, next));

/* GET User tickets */
router.get('/tickets',
  usersMiddleware.getUserIdfromUUID,
  ticketsMiddleware.getUserTickets);

/* POST Buy tickets for some user */
/* TODO
  - Auto increment number of ticket based on the show
*/
router.post('/tickets',
  usersMiddleware.decodeAndVerifyUser,
  ticketsMiddleware.buyTickets,
  vouchersMiddleware.generateVouchers,
  transactionsMiddleware.createTransaction,
  vouchersMiddleware.generateSpecialVoucher);

/* GET User vouchers */
router.get('/vouchers',
  usersMiddleware.getUserIdfromUUID,
  vouchersMiddleware.getUserVouchers);

/* GET User transactions */
router.get('/transactions',
  usersMiddleware.getUserIdfromUUID,
  transactionsMiddleware.getUserTransactions);

/* POST User order */
router.post('/order',
  usersMiddleware.getUserIdfromUUID,
  transactionsMiddleware.createCafeteriaTransaction);

module.exports = router;
