// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Hardcoded admin credentials
const adminCredentials = {
  email: 'admin@example.com',
  password: 'adminpassword',
  id: 'admin_id', // You can use a fixed ID for admin
  name: 'Admin User',
  role: 'admin'
};

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const newUser = new User({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      role
    });

    await newUser.save();
    res.json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check for fixed admin credentials
  if (email === adminCredentials.email && password === adminCredentials.password) {
    const token = jwt.sign(
      { id: adminCredentials.id, role: adminCredentials.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token, user: adminCredentials });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
