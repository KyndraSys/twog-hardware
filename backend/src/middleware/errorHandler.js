const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error('Error:', err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
};