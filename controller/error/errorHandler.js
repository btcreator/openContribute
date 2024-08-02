// Error handlers
////
// Operational errors
const handleAppError = (err) => ({
  statusCode: err.statusCode,
  message: err.message,
});

// Mongoose validation error
const handleValidationError = (err) => {
  const errors = Object.keys(err.errors);
  return {
    statusCode: 400,
    message: `Please provide a valid ${errors}`,
  };
};

// Default -an unexpected- error
const handleUnexpectedError = () => ({
  statusCode: 500,
  message: "Something went wrong.",
});

// Routing each error to his error handler. The last one is a default behavior
const errorRouter = function (err) {
  if (err.name === "AppError") return handleAppError(err);
  if (err.name === "ValidationError") return handleValidationError(err);
  return handleUnexpectedError();
};

// Global error handler
exports.globalErrorHandler = function (err, req, res, next) {
  let error = errorRouter(err);

  if (process.env.NODE_ENV === "development") error.err = err.stack;

  const statusCode = error.statusCode;
  delete error.statusCode;

  res.status(statusCode).json(Object.assign(error, { status: "error" }));
};
