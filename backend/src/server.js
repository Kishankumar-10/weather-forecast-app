const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const weatherController = require('./controllers/weatherController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Basic Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server running' });
});

// Weather Route (Updated to use Controller and Query Params)
app.get('/api/weather', weatherController.getWeather);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
