// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// --- CORRECT ROUTE IMPORTS ---
// Make sure these paths point to the 'routes' directory
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Initialize Express app
const app = express();

// CORS Configuration to work with Vite frontend
const allowedOrigins = [
  'http://localhost:5173', // Vite default dev server
  'http://localhost:3000', // Common alternative
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};
app.use(cors(corsOptions));


// Increase the limit for JSON requests and form data to handle large video uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server with error handling
const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Handle listen errors (like EADDRINUSE)
server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the process using this port or set a different PORT in your .env`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});

// Graceful shutdown handlers
const gracefulShutdown = async () => {
  console.log('Shutting down server gracefully...');
  try {
    await mongoose.disconnect();
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  } catch (e) {
    console.error('Error during shutdown:', e);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

