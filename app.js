const express = require('express');
const bodyParser = require('express').json;
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

const errorMiddleware = require('./middleware/errorMiddleware');
const { sequelize } = require('./models'); // Import from models/index.js

const app = express();

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(bodyParser());

// Logging middleware - logs every incoming request
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
// Alias: handle singular form as well
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);

app._router.stack.forEach(middleware => {
  if(middleware.route) {
    console.log(`[Route] ${Object.keys(middleware.route.methods)[0].toUpperCase()} - ${middleware.route.path}`)
  }
});


// 404 handler - must come after all routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler middleware - last
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

// Sync database and start server
sequelize.sync({ force: false }) // Use force: true only for development to recreate tables
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Failed syncing database:',
    
    
    err));


  