// Logging on server console with date
exports.serverLog = (message, ...args) => {
  const date = new Date().toISOString();
  console.log(`${date} > ${message}`, ...args);
};

// Middlewares (no endpoint)
////
// check if ID in params has right length
exports.checkId = function (req, res, next) {
  if (`${req.params.id}`.length !== 24) return next('route');
  next();
};
