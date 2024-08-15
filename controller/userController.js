const User = require("./../model/user");
const { logDeletedMeOutAndSend } = require("./authentication/authController");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const { cleanBody } = require("../utils/cleanIOdata");

// User "MY" operations
////
exports.myProfile = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

exports.updateMyProfile = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body, "role", "isActive");

  if (bodyCl.password)
    throw new AppError(
      400,
      "For password updates use the corresponding route."
    );

  Object.assign(req.user, bodyCl);

  const updatedUser = await req.user.save();

  res.status(200).json({
    status: "success",
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

  const user = await User.create(bodyCl);

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body, "password");

  const user = await User.findByIdAndUpdate(req.params.id, bodyCl, {
    runValidators: true,
    returnOriginal: false,
  }).select("isActive");

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.findUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select("isActive");

  res.status(200).json({
    status: "success",
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
  const users = await User.find({}).select("isActive");

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

// check if ID in params has right length
exports.checkId = function (req, res, next) {
  if (`${req.params.id}`.length !== 24) return next("route");
  next();
};
