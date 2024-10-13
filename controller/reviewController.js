const User = require('./../model/user');
const catchAsync = require('./../utils/catchAsync');
const refineQuery = require('./../utils/refineQuery');

exports.getLatestTenReviews = catchAsync(async (req, res) => {
  const reviews = await User.aggregate();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res) => {
  const revQuery = User.find({});
  const query = new refineQuery(revQuery, req.query).project().sort().paginate().query;

  const reviews = await query;

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
