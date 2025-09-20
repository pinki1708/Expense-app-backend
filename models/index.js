const sequelize = require('../config/database');
const User = require('./user');
const Category = require('./category');
const Expense = require('./expense');
const Budget = require('./budget');

// Define associations after all models are loaded
User.hasMany(Category, { foreignKey: 'userId', onDelete: 'CASCADE' });
Category.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Expense, { foreignKey: 'userId', onDelete: 'CASCADE' });
Expense.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Expense, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Expense.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(Budget, { foreignKey: 'userId', onDelete: 'CASCADE' });
Budget.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Category,
  Expense,
  Budget,
};

// Also export individual models for direct import
module.exports.User = User;
module.exports.Category = Category;
module.exports.Expense = Expense;
module.exports.Budget = Budget;