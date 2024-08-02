// Logging on server console with date
exports.serverLog = (message, ...args) => {
    const date = new Date().toISOString();
    console.log(`${date} > ${message}`, ...args);
};
