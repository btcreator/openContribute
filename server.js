// Load environment variables
process.env.NODE_ENV === 'development' && require('@dotenvx/dotenvx').config({ path: './config.env' });

// Error handling of unhandled exceptions (for example catch some bugs)
process.on('uncaughtException', (err) => {
  serverLog(`Uncaught exception: ${err}`);
  process.exit(1);
});

const mongoose = require('mongoose');
const app = require('./app');
const { serverLog } = require('./utils/helpers');

// Establish connection with the database
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => {
  serverLog(`Connection to database established...`);
});

// Start the server
const port = process.env.PORT || 3500;
const host = process.env.HOST || 'localhost';
const server = app.listen(port, host, () => {
  serverLog(`Server start up on port ${port}...`);
});

// Error handling for unhandled rejections (outside of express)
process.on('unhandledRejection', (err) => {
  serverLog(`Unhandled rejection: ${err}`);
  server.close(() => process.exit(1));
});

// Shut down the process when the server initate a termination signal
process.on('SIGTERM', () => {
  serverLog('SIGTERM received, terminating...');
  server.close(() => console.log('------ Process terminated.------'));
});
