const User = require('./../model/user');
const { logDeletedMeOutAndSend } = require('./authentication/authController');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const { cleanBody } = require('../utils/cleanIOdata');
const RefineQuery = require('../utils/refineQuery');
const { updateFilesOnDisk } = require('./staticFilesystem/staticFileController');

// User "MY" operations
////
exports.myProfile = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

exports.updateMyProfile = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body, 'role', 'isActive');

  if (bodyCl.password) throw new AppError(400, 'For password updates use the corresponding route.');

  if (typeof bodyCl.review === 'object' && !Array.isArray(bodyCl.review))
    req.user.review && req.user.review.set(bodyCl.review);
  else delete bodyCl.review;

  // user photo update sequence
  if (req.files) {
    if (req.user.photo === 'default.jpg') bodyCl.photo = req.files.userPhoto[0].filename;
    else await updateFilesOnDisk(req.files, { userPhoto: req.user.photo });
  }

  req.user.set(bodyCl);
  const updatedUser = await req.user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMyProfile = catchAsync(async (req, res) => {
  // set the user just to inactive and save the date of inactivation, for futher processes like: delete all user which are inactive after 3 months...
  req.user.isActive = false;
  req.user.setInactiveAt = Date.now();
  req.user.save();

  // log user out, and response with Status 204 - No content
  await logDeletedMeOutAndSend(res);
});

// CRUD operations
////
exports.createUser = catchAsync(async (req, res, next) => {
  const bodyCl = cleanBody(req.body);
  if (req.files) bodyCl.photo = req.files.userPhoto[0].filename;

  const user = await User.create(bodyCl);

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body, 'password');

  const user = await User.findById(req.params.id).select('+isActive');
  if (!user) throw new AppError(404, 'User not found');

  // convert review object to update fileds
  if (typeof bodyCl.review === 'object' && !Array.isArray(bodyCl.review)) user.review && user.review.set(bodyCl.review);
  else delete bodyCl.review;

  // user photo update sequence
  if (req.files) {
    if (user.photo === 'default.jpg') user.photo = req.files.userPhoto[0].filename;
    else await updateFilesOnDisk(req.files, { userPhoto: user.photo });
  }

  user.set(bodyCl);

  // save doc (update process dont work in mongoose on subdocuments with upsert, thats why find-save is used)
  const updatedUser = await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.findUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select('+isActive');

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).end();
});

// Get all users
exports.findAllUsers = catchAsync(async (req, res) => {
  const usersQuery = User.find({}).select('+isActive');
  if (req.query.fields) req.query.fields = cleanQueryFields(req.query.fields);

  // filter, sort, project and pageing the query before execute
  const query = new RefineQuery(usersQuery, req.query).refine();
  const users = await query;

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
