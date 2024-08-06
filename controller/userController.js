const User = require("./../model/user");
const catchAsync = require("./../utils/catchAsync");

// CRUD operations
//// just for admins
exports.createUser = catchAsync(async (req, res) => {
  ["resetTokenExpire", "passwordResetToken"].forEach(
    (prop) => delete req.body[prop]
  );
  const user = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  ["resetTokenExpire", "passwordResetToken", "password"].forEach(
    (prop) => delete req.body[prop]
  );
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    returnOriginal: false,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.findUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json();
});

// restricted to admins too!
// get all users
exports.findAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({});

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
