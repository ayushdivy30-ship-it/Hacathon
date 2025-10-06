const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gyansetu';

const users = [
  {
    name: 'Test Admin',
    email: 'testadmin@example.com',
    password: 'Admin@1234',
    role: 'admin'
  },
  {
    name: 'Test Teacher',
    email: 'testteacher@example.com',
    password: 'Teacher@1234',
    role: 'teacher'
  }
];

const createUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    for (const u of users) {
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        console.log(`User already exists: ${u.email}`);
        continue;
      }
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(u.password, salt);
      const user = new User({ name: u.name, email: u.email, password: hashed, role: u.role });
      await user.save();
      console.log(`Created user: ${u.email} (role: ${u.role})`);
    }

    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Error creating test users', err);
    process.exit(1);
  }
};

createUsers();
