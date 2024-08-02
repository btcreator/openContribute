const User = require("../../model/user");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { serverLog } = require("../../utils/helpers");
const { promisify } = require("util");

// Generate and set jwt token on response cookies or destroy token cookie
const setJWTcookie = (id, res) => {
  const options = { httpOnly: true, secure: true };

  if (!id) return res.clearCookie("jwt", options);

  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.cookie("jwt", token, options);
};

// Authentication routes
////
exports.signup = catchAsync(async (req, res) => {
  // destructuring, so no one can inject suspicious data to database
  const { email, password, confirmPassword } = req.body;

  // confirmPassword is a virtual property - get not written in to the database
  const user = await User.create({ email, password, confirmPassword });

  setJWTcookie(user._id, res);

  // 201 - new resource is created
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // check if user found and if the password is correct
  if (!user || !(await User.checkPassword(password, user.password)))
    throw new AppError(401, "Wrong email or password.");

  setJWTcookie(user._id, res);

  // 200 - OK
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.logout = catchAsync(async (req, res) => {
  // destroy token cookie
  setJWTcookie(null, res);

  res.status(200).json({
    status: "success",
    message: "Logged out successfully.",
  });
});

// Middlewares (no endpoint)
////
exports.authenticate = catchAsync(async (req, res, next) => {
  // get the token
  const token = req.cookies.jwt;
  if (!token) throw new AppError(403, "You need to be logged in to access.");

  // verify token
  const tokenData = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  ).catch((err) => {
    serverLog(`Security log: ${err.name} - ${err.message}`);
    throw new AppError(401, "Invalid token. Please login again.");
  });

  // check if user still exists
  const user = await User.findById(tokenData.id);
  if (!user)
    throw new AppError(401, "User does no longer exists. Please login again.");

  // access granted
  next();
});
