const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(async () => {
    const User = require('./models/User');
    const existing = await User.findOne({ email: 'admin@gmail.com' });
    if (existing) {
      console.log('✅ Admin already exists!');
    } else {
      const password = bcrypt.hashSync('admin123', 10);
      await User.create({ name: 'Admin User', email: 'admin@gmail.com', password, role: 'admin' });
      console.log('✅ Admin user created! Email: admin@gmail.com | Password: admin123');
    }
    mongoose.disconnect();
  })
  .catch(err => console.error('❌ Error:', err.message));
