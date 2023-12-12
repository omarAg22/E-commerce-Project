const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuthCustomer');

const {
  createCustomer,
  loginCostumer,
  getAllCostumers,
  searchCostumer,
  getCostumerById,
  updateCostumerVv,
  updateProfile
} = require('../controllers/costumerController');

router.post('/createCustomer', createCustomer);
router.post('/loginCustomer', loginCostumer);
router.put('/profile',isAuth, updateProfile);
router.get('/getAllCostumers',getAllCostumers);
router.get('/searchCostumer', searchCostumer);
router.put('/valid/:id', updateCostumerVv);
router.get('/getCostumerById/:id', getCostumerById);

module.exports = router;
