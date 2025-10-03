const sequelize = require('./config/database');
const User = require('./models/User'); // import all your models here

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // alter: true updates tables if model changes
    console.log('All tables synced successfully!');
    process.exit(0); // exit after syncing
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
};

syncDatabase();
