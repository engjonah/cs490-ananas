const app = require('./app');
const express = require('express');
const path = require('path');
require('dotenv').config();

const port = process.env.PORT || 3000;

// Serve static files from the 'frontend/build' directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')));

  // Define routes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// Define all other routes before this runs
app.use('*', (req, res) => {
  res.status(404).send('Route not found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
