const cors = require('cors');
const connectDB = require("./db/conn");
const router = require('./routes');
const express = require('express');
const path = require('path');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// API routes
app.use('/api', router);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Ensure that all other routes are handled by your React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

module.exports = app;
