const { Category } = require('../models');

const createCategory = async (req, res) => {
  const { userId } = req;
  const { name } = req.body;

  try {
    const category = await Category.create({ userId, name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

const getCategories = async (req, res) => {
  const { userId } = req;

  try {
    const categories = await Category.findAll({ where: { userId } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const { name } = req.body;

  try {
    const category = await Category.findOne({ where: { id, userId } });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await category.update({ name });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  try {
    const category = await Category.findOne({ where: { id, userId } });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
