exports.globalErrorHandler = function (err, req, res, next) {
  res.status(404).json({
    status: "error",
    message: err.message,
    err: err.stack,
  });
};
