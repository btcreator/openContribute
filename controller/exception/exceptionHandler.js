const AppError = require('../../utils/appError');
const { clearImages } = require('../staticFilesystem/staticFileController');

// Enumerate error fields in a text form like "email, password and name"
const _enumerateErrors = function (errObj) {
  const errors = Object.keys(errObj);
  const last = errors.pop();
  const errTxt = errors.join(', ');

  return `${errTxt}${errTxt && ' and '}${last}`;
};
// Error handlers
////
// Operational errors
const _handleAppError = (err) => ({
  statusCode: err.statusCode,
  message: err.message,
});

// Mongoose validation error
const _handleValidationError = (err) => ({
  statusCode: 400,
  message: `Please provide a valid ${_enumerateErrors(err.errors)}`,
});

// Mongo database error
const _handleMongoError = (err) => {
  const message =
    err.code === 11000
      ? `Duplicate key(s). The ${_enumerateErrors(
          err.keyPattern
        )} should be a uniqe value, but it is/they are already in the database.`
      : 'Error thrown by database server. Try again.';

  return {
    statusCode: 500,
    message,
  };
};

// File grabbing error form Multer middleware
const _handleMulterError = (err) => {
  const message =
    err.code === 'LIMIT_FILE_SIZE'
      ? 'Max 5MB files are allowed to upload.'
      : 'An unexpected error happened while trying to upload the media file. Check your file for right format, then try again.';
  return {
    statusCode: 520,
    message,
  };
};

// Default -an unexpected- error
const _handleUnexpectedError = () => ({
  statusCode: 500,
  message: 'Something went wrong.',
});

// Routing each error to his error handler. The last one is a default behavior
const _errorRouter = function (err) {
  if (err.name === 'AppError') return _handleAppError(err);
  if (err.name === 'ValidationError') return _handleValidationError(err);
  if (err.name === 'MongoServerError') return _handleMongoError(err);
  if (err.name === 'MulterError') return _handleMulterError(err);
  return _handleUnexpectedError();
};

// Global error handler
exports.globalErrorHandler = function (err, req, res, next) {
  // remove uploaded files (it would just pollute the server space capacity)
  clearImages(req.files);

  let error = _errorRouter(err);

  if (process.env.NODE_ENV === 'development') error.err = err.stack;

  const statusCode = error.statusCode;
  delete error.statusCode;

  res.status(statusCode).json(Object.assign(error, { status: 'error' }));
};

// Global route handler
exports.globalRouteHandler = function (req, res) {
  throw new AppError(404, 'Sorry, the route what you looking for does not exist.');
};
