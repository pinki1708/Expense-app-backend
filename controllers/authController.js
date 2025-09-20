const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Register function: reads parameters from query string, normalizes email, and returns token
const register = async (req, res) => {
  const { name, email: emailRaw, password } = req.query;
  if (!name || !emailRaw || !password)
    return res.status(400).json({ message: 'Name, email, and password are required' });

  const email = emailRaw.trim().toLowerCase(); // Normalize email to avoid duplicate cases

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    // Generate JWT token upon registration
    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret_key', { expiresIn: '1d' });

    return res.status(201).json({
      message: 'User registered successfully',
      userId: user.id,
      token // Return the token
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Login function: reads parameters from query string, normalizes email, and returns token
const login = async (req, res) => {
  const { email: emailRaw, password } = req.query;
  if (!emailRaw || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  const email = emailRaw.trim().toLowerCase();

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret_key', { expiresIn: '7d' });
   
    return res.json({
      error: false,
      message: 'Login successful',
      userId: user.id,
      token
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { register, login };
