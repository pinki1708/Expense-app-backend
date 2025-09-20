const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Amount is required'
      },
      isFloat: {
        msg: 'Amount must be a number'
      },
      min: {
        args: [0],
        msg: 'Amount must be positive'
      }
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Date is required'
      },
      isDate: {
        msg: 'Must be a valid date'
      }
    }
  },
  description: {
    type: DataTypes.STRING,
  },
  receiptUrl: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // categoryId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true, // Allow null for SET NULL on delete
  // },
}, {
  timestamps: true,
});

module.exports = Expense;
