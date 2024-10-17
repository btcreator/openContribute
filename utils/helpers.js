const { isObjectIdOrHexString } = require('mongoose');

// Logging on server console with date
exports.serverLog = (message, ...args) => {
  const date = new Date().toISOString();
  console.log(`${date} > ${message}`, ...args);
};

// Middlewares (no endpoint)
////
// check if ID in params has right length
exports.checkId = (req, res, next) => {
  return isObjectIdOrHexString(req.params.id) ? next() : next('route');
};
