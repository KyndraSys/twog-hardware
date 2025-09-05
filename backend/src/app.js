const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./models');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api', routes);

// Serve React build (static files)
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all to serve React’s index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Error handler (keep this last, after routes)
app.use(errorHandler);

module.exports = app;
