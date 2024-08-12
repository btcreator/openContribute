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
  cleanBody(req.body, "role", "isActive");

  if (req.body.password)
    throw new AppError(
      400,
      "For password updates use the corresponding route."
    );

  Object.assign(req.user, req.body);

  const updatedUser = await req.user.save();

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMyProfile = catchAsync(async (req, res) => {
  // set the user just to inactive and save the date when, for futher processes like: delete all user which are inactive after 3 months...
  req.user.isActive = false;
  req.user.setInactiveAt = Date.now();
  req.user.save();

  // log user out, and response with Status 204 - No content
  await logDeletedMeOutAndSend(res);
});

// CRUD operations
////
exports.createUser = catchAsync(async (req, res) => {
  cleanBody(req.body);

  const user = (await User.create(req.body)).toObject({ user: req.user.role });

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  cleanBody(req.body, "password");

  const user = (
    await User.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      returnOriginal: false,
    })
  ).toObject({ user: req.user.role });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.findUser = catchAsync(async (req, res) => {
  const user = (await User.findById(req.params.id)).toObject({
    user: req.user.role,
  });

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

// get all users
exports.findAllUsers = catchAsync(async (req, res) => {
  // TODO build search with query
  const usersRes = await User.find({});

  // remove/allow in all docunemts in the result array sensitive data based on calling user role
  const users = usersRes.map((user) => user.toObject({ user: req.user.role }));

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

// check if ID in params is right (length)
exports.checkId = function (req, res, next) {
  if (`${req.params.id}`.length !== 24) return next("route");
  next();
};
