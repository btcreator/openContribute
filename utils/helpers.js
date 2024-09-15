const { ObjectId } = require('mongoose').Types;

// Logging on server console with date
exports.serverLog = (message, ...args) => {
  const date = new Date().toISOString();
  console.log(`${date} > ${message}`, ...args);
};

// Middlewares (no endpoint)
////
// check if ID in params has right length
exports.checkId = (req, res, next) => {
  try {
    new ObjectId(`${req.params.id}`);
  } catch {
    return next('route');
  }
  next();
};
