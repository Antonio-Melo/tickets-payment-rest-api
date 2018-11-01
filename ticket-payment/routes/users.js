const express = require('express');
const router = express.Router();

const usersMiddleware = require('../middleware/users');

/* USER ROUTES */

/* GET Sign up user */
router.post('/signup',
  usersMiddleware.checkUserDataRegister);

/* POST Sign in user */
router.post('/signin', (req, res) => res.sendStatus(200));

/* GET User tickets */
router.get('/tickets', (req, res) => res.sendStatus(200));

/* POST Buy tickets for some user */
router.post('/tickets', (req, res) => res.sendStatus(200));

/* GET User vouchers */
router.get('/vouchers', (req, res) => res.sendStatus(200));

/* GET User transactions */
router.get('/transactions', (req, res) => res.sendStatus(200));

module.exports = router;
