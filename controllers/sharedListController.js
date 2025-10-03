const { SharedList, SharedExpense, SharedListUser } = require('../models');
const crypto = require('crypto');

// Create a new shared list
const createSharedList = async (req, res) => {
  const { userId, name } = req.body;
  if (!userId || !name) return res.status(400).json({ message: 'userId and name required' });

  const shareCode = crypto.randomBytes(4).toString('hex'); // Unique 8-char code

  try {
    const list = await SharedList.create({ name, ownerId: userId, shareCode });
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create shared list', error: error.message });
  }
};

// Join a shared list using shareCode
const joinSharedList = async (req, res) => {
  const { userId, shareCode } = req.body;
  if (!userId || !shareCode) return res.status(400).json({ message: 'userId and shareCode required' });

  try {
    const list = await SharedList.findOne({ where: { shareCode } });
    if (!list) return res.status(404).json({ message: 'Shared list not found' });

    // Check if user already joined
    const alreadyJoined = await SharedListUser.findOne({
      where: { sharedListId: list.id, userId }
    });
    if (alreadyJoined) return res.status(400).json({ message: 'User already joined this list' });

    // Add user to the shared list
    const join = await SharedListUser.create({ sharedListId: list.id, userId });

    res.status(201).json({ message: 'Joined shared list successfully', join });
  } catch (error) {
    res.status(500).json({ message: 'Failed to join shared list', error: error.message });
  }
};

// Add expense to shared list
const addSharedExpense = async (req, res) => {
  const { shareCode, userId, description, amount } = req.body;
  if (!shareCode || !userId || !amount) return res.status(400).json({ message: 'shareCode, userId, amount required' });

  try {
    const list = await SharedList.findOne({ where: { shareCode } });
    if (!list) return res.status(404).json({ message: 'Shared list not found' });

    const expense = await SharedExpense.create({
      description,
      amount,
      userId,
      sharedListId: list.id,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add expense', error: error.message });
  }
};

// Update expense in a shared list
const updateSharedExpense = async (req, res) => {
  const { id, userId, shareCode, description, amount } = req.body;
  if (!id || !userId || !shareCode) {
    return res.status(400).json({ message: 'id, userId, and shareCode required' });
  }

  try {
    // Verify shared list
    const list = await SharedList.findOne({ where: { shareCode } });
    if (!list) return res.status(404).json({ message: 'Shared list not found' });

    // Find the expense
    const expense = await SharedExpense.findOne({ where: { id, sharedListId: list.id } });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    // Only owner of expense can update
    if (expense.userId != userId) {
      return res.status(403).json({ message: 'Not authorized to update this expense' });
    }

    // Update fields
    if (description !== undefined) expense.description = description;
    if (amount !== undefined) expense.amount = amount;

    await expense.save();

    res.json({ message: 'Expense updated successfully', expense });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update expense', error: error.message });
  }
};

// Delete expense from a shared list
const deleteSharedExpense = async (req, res) => {
  const { id, userId, shareCode } = req.query;
  if (!id || !userId || !shareCode) {
    return res.status(400).json({ message: 'id, userId, and shareCode required' });
  }

  try {
    // Verify shared list
    const list = await SharedList.findOne({ where: { shareCode } });
    if (!list) return res.status(404).json({ message: 'Shared list not found' });

    // Find the expense
    const expense = await SharedExpense.findOne({ where: { id, sharedListId: list.id } });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    // Only owner of expense can delete
    if (expense.userId != userId) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await expense.destroy();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete expense', error: error.message });
  }
};


// Get expenses for a shared list
const getSharedExpenses = async (req, res) => {
  const { shareCode } = req.query;
  if (!shareCode) return res.status(400).json({ message: 'shareCode required' });

  try {
    const list = await SharedList.findOne({ where: { shareCode }, include: SharedExpense });
    if (!list) return res.status(404).json({ message: 'Shared list not found' });

    res.json(list.SharedExpenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: error.message });
  }
};

// Delete a shared list along with its expenses
const deleteSharedList = async (req, res) => {
  const { id, userId } = req.query;  // list id + optional userId
  if (!id) return res.status(400).json({ message: 'List id required' });

  try {
    const list = await SharedList.findByPk(id);
    if (!list) return res.status(404).json({ message: 'Shared list not found' });

    // Optional ownership check
    if (userId && list.ownerId != userId) {
      return res.status(403).json({ message: 'You are not the owner of this list' });
    }

    await SharedExpense.destroy({ where: { sharedListId: id } });
    await SharedListUser.destroy({ where: { sharedListId: id } });
    await SharedList.destroy({ where: { id } });

    res.json({ message: 'Shared list and its expenses deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete shared list', error: error.message });
  }
};



// Get all lists for a user (created or joined)
const getUserLists = async (req, res) => {
  const { userId } = req.query;  // get userId from query
  if (!userId) return res.status(400).json({ message: 'userId required' });

  try {
    // Lists created by the user
    const createdLists = await SharedList.findAll({ where: { ownerId: userId } });

    // Lists joined by the user
    const joinedListRelations = await SharedListUser.findAll({ where: { userId } });
    const joinedListIds = joinedListRelations.map(rel => rel.sharedListId);
    const joinedLists = joinedListIds.length > 0
      ? await SharedList.findAll({ where: { id: joinedListIds } })
      : [];

    res.json({ createdLists, joinedLists });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user lists', error: error.message });
  }
};

module.exports = {
  createSharedList,
  joinSharedList,
  addSharedExpense,
  getSharedExpenses,
  deleteSharedList,
  getUserLists,
  updateSharedExpense,
  deleteSharedExpense
};
