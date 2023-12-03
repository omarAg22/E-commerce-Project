const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuthCustomer');
const { createOrder, getOrder, payOrder } = require('../controllers/orderController');

router.post('/create-order', isAuth, createOrder);
router.get('/get-order/:id', isAuth, getOrder);
router.put('/:id/pay', isAuth, payOrder);

module.exports = router;
