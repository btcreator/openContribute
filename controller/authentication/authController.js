const User = require("../../model/user");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { serverLog } = require("../../utils/helpers");
const { promisify } = require("util");

// Generate and set jwt token on response cookies or destroy token cookie
const setJWTandSend = async (res, statusCode, resPayload, jwtPayload) => {
  const options = { httpOnly: true, secure: true };

  // if no id provided, clear cookie, else sign token
  if (!jwtPayload) res.clearCookie("jwt", options);
  else {
    const token = await promisify(jwt.sign)(
      jwtPayload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    res.cookie("jwt", token, options);
  }

  res.status(statusCode).json({
    status: "success",
    data: resPayload,
  });
};

// Authentication routes
////
exports.signup = catchAsync(async (req, res) => {
  // destructuring, so no one can inject suspicious data to database
  const { email, password, confirmPassword } = req.body;

  // confirmPassword is a virtual property - get not written in to the database
  const user = await User.create({ email, password, confirmPassword });

  await setJWTandSend(res, 201, { user }, { id: user._id });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // check for incoming data presence
  if (!email || !password)
    throw new AppError(401, "Please enter an email and password to login.");

  // find user
  const user = await User.findOne({ email });

  // check if user found and if the password is correct
  if (!user || !(await User.checkPassword(password, user.password)))
    throw new AppError(401, "Wrong email or password.");

  await setJWTandSend(res, 200, { user }, { id: user._id });
});

exports.logout = catchAsync(async (req, res) => {
  // destroy token cookie
  await setJWTandSend(res, 200, { message: "You logged out successfully" });
});

// Password related routes
////
exports.changeMyPassword = catchAsync(async (req, res) => {
  const user = req.user;
  const { newPassword, confirmPassword } = req.body;

  // proof incoming data
  if (!newPassword || !confirmPassword)
    throw new AppError(401, "Please provide and confirm your new password.");

  // confirm password equalty
  if (!(await User.checkPassword(req.body.password, user.password)))
    throw new AppError(401, "Wrong password.");

  // set new password
  user.password = newPassword;
  user.confirmPassword = confirmPassword;

  await user.save();

  await setJWTandSend(res, 200, { user });
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
  req.user = user;
  next();
});
