const { Sequelize } = require('sequelize');

// Determine database configuration based on environment
const isProduction = process.env.NODE_ENV === 'production';
const dialect = process.env.DB_DIALECT || 'mysql';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'expense_app_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'pinki',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: dialect,
    logging: false,
    port: process.env.DB_PORT || 3306,
    dialectOptions: {}
  }
);

const testConnection = async () => {
  try {
    console.log('Database configuration:', {
      dialect: dialect,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'expense_app_db',
      username: process.env.DB_USER || 'root',
      isProduction: isProduction
    });
    
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize;
