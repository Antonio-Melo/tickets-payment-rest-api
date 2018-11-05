const express = require('express');
const router = express.Router();
const passport = require('../auth/passport');
const usersMiddleware = require('../middleware/users');
const ticketsMiddleware = require('../middleware/tickets');
const vouchersMiddleware = require('../middleware/vouchers');

/* USER ROUTES */

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
    return res.sendStatus(204);
  })(req, res, next));

/* GET User tickets */
router.get('/tickets',
  usersMiddleware.getUserIdfromUUID,
  ticketsMiddleware.getUserTickets);

/* POST Buy tickets for some user */
router.post('/tickets', (req, res) => res.sendStatus(200));

/* GET User vouchers */
router.get('/vouchers',
  usersMiddleware.getUserIdfromUUID,
  vouchersMiddleware.getUserVouchers);

/* GET User transactions */
router.get('/transactions', (req, res) => res.sendStatus(200));

module.exports = router;
