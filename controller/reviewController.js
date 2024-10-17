const { cleanQueryFields } = require('../utils/cleanIOdata');
const User = require('./../model/user');
const catchAsync = require('./../utils/catchAsync');
const refineQuery = require('./../utils/refineQuery');

exports.getLatestTenReviews = catchAsync(async (req, res) => {
  const reviews = await User.find({ isActive: true, 'review.review': { $exists: true } })
    .sort('-review.updatedAt')
    .limit(10)
    .select('-_id name photo review');

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res) => {
  const revQuery = User.find({ isActive: true, review: { $exists: true } });
  if (req.query.fields) req.query.fields = cleanQueryFields(req.query.fields);

  const query = new refineQuery(revQuery, req.query).project('-_id review name photo').sort().paginate().query;

  const reviews = await query;

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
