const express = require('express');
const router = express.Router();
const {
  addUser,
  loginUser,
  getAllUsers,
  getUserById,
  searchForUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router.post('/addUser', addUser);
router.post('/login', loginUser);
router.get('/all-users', getAllUsers);
router.get('/getUser/:id', getUserById);
router.get('/searchUser', searchForUser);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);

module.exports = router;
