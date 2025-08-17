// server.js
const app = require('./src/app');
const logger = require('./src/utils/logger');
const db = require('./src/config/db');

const startServer = async () => {
  try {
    await db.query('SELECT 1'); // Test database connection
    logger.info('Database connected successfully');
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));

    // Error handling for uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err.stack);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    logger.error('Failed to start server:', err.stack);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown handlers
const shutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  try {
    await db.end();
    process.exit(0);
  } catch (err) {
    logger.error('Error during shutdown:', err.stack);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));