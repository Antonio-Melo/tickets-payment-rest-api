const express = require('express');
const router = express.Router();
const ordersMiddleware = require('../middleware/orders');

/* GET orders*/
router.get('/', ordersMiddleware.getOrders);
router.post('/', ordersMiddleware.validateOrder);

module.exports = router;
