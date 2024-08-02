// In the app gets thrown an appError, so gets tracked the status code - this gets handled in the global error handler
class appError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

module.exports = appError;
