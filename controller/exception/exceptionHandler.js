const AppError = require('../../utils/appError');
const ErrorStack = require('../../model/error');
const { clearImages } = require('../staticFilesystem/staticFileController');

// Enumerate error fields in a text form like "email, password and name"
const _enumerateErrors = function (errObj) {
  const errors = Object.keys(errObj);
  const last = errors.pop();
  const errTxt = errors.join(', ');

  return `${errTxt}${errTxt && ' and '}${last}`;
};

// Save errors for later debug/review
const _saveError = async function (err) {
  const error = await ErrorStack.create({ error: err });

  return error._id;
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
  let message =
    'An unexpected error happened while trying to upload the media file. Check your file for right format, then try again.';
  if (err.code === 'LIMIT_FILE_SIZE') message = 'Max file size limit reached.';
  if (err.code === 'LIMIT_UNEXPECTED_FILE') message = `Unexpected field: ${err.field}`;
  return {
    statusCode: 400,
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
exports.globalErrorHandler = async function (err, req, res, next) {
  // remove uploaded files (it would just pollute the server space capacity)
  clearImages(req.files);

  let error = _errorRouter(err);

  if (process.env.NODE_ENV === 'development') error.err = err.stack;

  const statusCode = error.statusCode;
  delete error.statusCode;

  if (req.originalUrl.startsWith('/api')) return res.status(statusCode).json(Object.assign(error, { status: 'error' }));

  // All error gets saved, just 4xx not (save db space)
  const errorID = statusCode % 400 >= 100 ? await _saveError(err) : '';

  res.status(statusCode).render('error', {
    title: 'Ups...',
    user: req.user,
    message: error.message,
    errorID,
  });
};

// Global route handler
exports.globalRouteHandler = function (req, res) {
  throw new AppError(404, 'Sorry, the route what you looking for does not exist.');
};
