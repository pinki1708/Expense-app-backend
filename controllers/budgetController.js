const { Budget } = require('../models');

const createBudget = async (req, res) => {
  const { userId } = req;
  const { amount, month, year } = req.body;

  try {
    const existingBudget = await Budget.findOne({ where: { userId, month, year } });
    if (existingBudget) return res.status(400).json({ message: 'Budget already set for this month/year' });

    const budget = await Budget.create({ userId, amount, month, year });
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create budget', error: error.message });
  }
};

const getBudgets = async (req, res) => {
  const { userId } = req;

  try {
    const budgets = await Budget.findAll({ where: { userId } });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch budgets', error: error.message });
  }
};

const updateBudget = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const { amount, month, year } = req.body;

  try {
    const budget = await Budget.findOne({ where: { id, userId } });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    await budget.update({ amount, month, year });
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update budget', error: error.message });
  }
};

const deleteBudget = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  try {
    const budget = await Budget.findOne({ where: { id, userId } });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    await budget.destroy();
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete budget', error: error.message });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};
