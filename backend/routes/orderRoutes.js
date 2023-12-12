const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuthCustomer');
const { createOrder, getOrder, payOrder, myOrders,getOrders,deliverOrder } = require('../controllers/orderController');

router.post('/create-order', isAuth, createOrder);
router.get('/mine', isAuth, myOrders);
router.get('/get-order/:id', isAuth, getOrder);
router.put('/:id/pay', isAuth, payOrder);
router.put('/:id/deliver', deliverOrder);
router.get('/',getOrders);

module.exports = router;
