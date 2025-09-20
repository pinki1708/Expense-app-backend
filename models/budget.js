const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

Budget.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Budget, { foreignKey: 'userId' });

module.exports = Budget;
