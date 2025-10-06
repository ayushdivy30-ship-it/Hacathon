// backend/scripts/printUser.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = process.argv[2];
    if (!email) {
      console.error('Usage: node printUser.js user@example.com');
      process.exit(1);
    }
    const user = await User.findOne({ email });
    console.log('User:', user);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();