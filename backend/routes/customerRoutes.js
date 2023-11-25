const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const checkRole = require('../middleware/checkRole');

const {
  createCustomer,
  loginCostumer,
  getAllCostumers,
  searchCostumer,
  getCostumerById,
  updateCostumerVv,
} = require('../controllers/costumerController');

router.post('/createCustomer', createCustomer);
router.post('/loginCustomer', loginCostumer);
router.get('/getAllCostumers',requireAuth,checkRole, getAllCostumers);
router.get('/searchCostumer', searchCostumer);
router.get('/getCostumerById/:id', getCostumerById);
router.put('/valid/:id', updateCostumerVv);

module.exports = router;
