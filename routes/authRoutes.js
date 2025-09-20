const express = require('express');
const { register, login } = require('../controllers/authController');
const { Expense } = require('../models');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/expenses',Expense)

module.exports = router;
