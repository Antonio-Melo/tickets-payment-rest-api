const express = require('express');
const router = express.Router();
const usersMiddleware = require('../middleware/users');


router.post('/',
  usersMiddleware.checkUserDataRegister);

module.exports = router;
