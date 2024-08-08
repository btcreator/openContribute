const AppError = require("../../utils/appError");

// Enumerate error fields in a text form like "email, password and name"
const enumerateErrors = function (errObj) {
  const errors = Object.keys(errObj);
  const last = errors.pop();
  const errTxt = errors.join(", ");

  return `${errTxt}${errTxt && " and "}${last}`;
};
// Error handlers
////
// Operational errors
const handleAppError = (err) => ({
  statusCode: err.statusCode,
  message: err.message,
});

// Mongoose validation error
const handleValidationError = (err) => ({
  statusCode: 400,
  message: `Please provide a valid ${enumerateErrors(err.errors)}`,
});

// Mongo database error
const handleMongoError = (err) => {
  const message =
    err.code === 11000
      ? `Duplicate key(s). The ${enumerateErrors(
          err.keyPattern
        )} should be a uniqe value, but it is/they are already in the database.`
      : "Error thrown by database server. Try again.";

  return {
    statusCode: 500,
    message,
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
  if (err.name === "MongoServerError") return handleMongoError(err);
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

// Global route handler
exports.globalRouteHandler = function (req, res) {
  throw new AppError(
    404,
    "Sorry, the route what you looking for does not exist."
  );
};
