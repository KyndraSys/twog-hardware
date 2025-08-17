const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

app.use(cors({
  origin: 'http://localhost:5173', // Allow your React dev server
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true // Enable if using cookies or authentication
}));

app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

module.exports = app;