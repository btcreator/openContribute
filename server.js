const mongoose = require('mongoose');
const app = require('./app');
const { serverLog } = require('./utils/helpers');

// Load environment variables
require('@dotenvx/dotenvx').config({ path: './config.env' });

// Establish connection with the database
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
mongoose
    .connect(DB)
    .then(() => {
        serverLog(`Connection to database established...`);
    })
    .catch((err) => {
        serverLog(`Connection to database is terminated...`, err);
    });

// Start the server
const port = process.env.PORT || 3500;
const host = process.env.HOST || 'localhost';
app.listen(port, host, () => {
    serverLog(`Server start up on host:port ${host}/${port}...`);
});
