const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verifyAdmin } = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/register', register);
router.post('/login', login);

router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users.', error: err.message });
  }
});

router.post('/create-admin', verifyAdmin, async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email and password are required.' });
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered.' });
    const hashedPassword = bcrypt.hashSync(password, 10);
    await User.create({ name, email, password: hashedPassword, role: 'admin' });
    res.status(201).json({ message: 'Admin created successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create admin.', error: err.message });
  }
});

router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user.', error: err.message });
  }
});

module.exports = router;
