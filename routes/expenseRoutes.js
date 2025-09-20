
const express = require('express');
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all expense routes
router.use(authMiddleware);

// Expense routes
router.post('/', createExpense);       // Create expense
router.get('/', getExpenses);          // Get all expenses
router.put('/:id', updateExpense);     // Update expense by ID
router.delete('/:id', deleteExpense);  // Delete expense by ID

module.exports = router;
