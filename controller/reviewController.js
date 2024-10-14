const { cleanQueryFields } = require('../utils/cleanIOdata');
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
  const revQuery = User.find({ review: { $exists: true } });
  if (req.query.fields) req.query.fields = cleanQueryFields(req.query.fields);

  const query = new refineQuery(revQuery, req.query).project('-_id review rating name photo').sort().paginate().query;

  const reviews = await query;

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
