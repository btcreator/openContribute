// Wraps an async function in a try - catch block
module.exports = function (asyncFunc) {
  return async function (req, res, next) {
    try {
      await asyncFunc(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
