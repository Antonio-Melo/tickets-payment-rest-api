const express = require('express');
const router = express.Router();

/* VALIDATION */

/* POST validate tickets */
router.post('/tickets', (req, res) => res.sendStatus(200));

/* POST validate vouchers */
router.post('/vouchers', (req, res) => res.sendStatus(200));

module.exports = router;
