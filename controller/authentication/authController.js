const User = require('../../model/user');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const jwt = require('jsonwebtoken');
const Email = require('../../utils/email');
const { convert } = require('html-to-text');
const { serverLog } = require('../../utils/helpers');
const { promisify } = require('util');
const emailMarkup = require('../../utils/emailMarkup');
const { ObjectId } = require('mongoose').Types;

const _cookieOptions = {
  expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  partitioned: true,
};

// Token related functions
////
// Generate jwt token
const _signJWT = (jwtPayload) => {
  jwtPayload.iat = Date.now() / 1000;
  return promisify(jwt.sign)(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Verify jwt token
const _verifyJWT = (token) =>
  promisify(jwt.verify)(token, process.env.JWT_SECRET).catch((err) => {
    serverLog(`Security log: ${err.name} - ${err.message}`);
    throw new AppError(401, 'Invalid token. Please log in again.');
  });

// Special case functions - No Middlewares, No Routes
////
// Log out the user after a delete operation - reset cookie
exports.logDeletedMeOutAndSend = async (res) => {
  res.clearCookie('jwt', _cookieOptions);
  res.status(204).end();
};

// Authentication routes
////
exports.signup = catchAsync(async (req, res, next) => {
  // destructuring, so no one can inject suspicious data to database
  const { email, password, confirmPassword } = req.body;

  // create new user
  const user = await User.create({ email, password, confirmPassword });

  // create jwt token and set cookie
  const token = await _signJWT({ id: user._id });
  res.cookie('jwt', token, _cookieOptions);

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // check for incoming data presence
  if (!email || !password) throw new AppError(400, 'Please enter an email and password to log in.');

  // find user
  const user = await User.findOne({ email, isActive: true });

  // check if user found and if the password is correct
  if (!user || !(await User.checkPassword(password, user.password)))
    throw new AppError(401, 'Wrong email or password.');

  // create jwt token and set cookie
  const token = await _signJWT({ id: user._id });
  res.cookie('jwt', token, _cookieOptions);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.logout = catchAsync(async (req, res) => {
  res.clearCookie('jwt', _cookieOptions);

  res.status(200).json({
    status: 'success',
    data: {
      message: 'You logged out successfully',
    },
  });
});

// Password related middlewares
////
exports.changeMyPassword = catchAsync(async (req, res) => {
  const user = req.user;
  const { password, newPassword, confirmPassword } = req.body;

  // proof incoming data
  if (!password) throw new AppError(400, 'Please provide your password.');
  if (!newPassword || !confirmPassword) throw new AppError(400, 'Please provide and confirm your new password.');

  // confirm password equalty
  if (!(await User.checkPassword(req.body.password, user.password))) throw new AppError(401, 'Wrong password.');

  // set new password
  user.password = newPassword;
  user.confirmPassword = confirmPassword;

  await user.save();

  res.status(200).json({
    status: 'success',
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  // get token - from query or body - allowing both for API implementor
  const token = req.body.token || req.query.token;
  if (!token) throw new AppError(400, 'No token provided');

  // get the rest of the data...
  const { password, confirmPassword } = req.body;

  // find user with token
  const passwordResetToken = User.hashToken(token);
  const user = await User.findOne({ passwordResetToken }, '+resetTokenExpire');

  // no user, no chocolate ;)
  if (!user) throw new AppError(401, 'We could not find your request, please try again or claim for new request.');

  // token expiration check
  const expired = user.isResetTokenExpired();

  // when everithing looks right, set new password - validation and hashing happens during the save process
  // when user just forgot his password, it is active anyway. When wants reactivate his profile, then it gets resetted
  if (!expired) {
    user.password = password;
    user.confirmPassword = confirmPassword;
    user.isActive = true;
  }

  // remove exp date and token - because its expired, or password gets reset
  user.resetTokenExpire = undefined;
  user.passwordResetToken = undefined;

  // save changes in db
  await user.save();

  // if token expired, throw error
  if (expired) throw new AppError(403, 'Your token is expired. Please claim for new token.');

  // response message
  res.status(200).json({
    status: 'success',
    data: {
      message: 'Password changed successfully. You can now log in.',
    },
  });
});

// Password recovering with verification trough email sent token - NEED A PREMIDDLEWARE
exports.passwordRecoveryProcess = catchAsync(async (req, res) => {
  // check if the requied data is sent with the request
  const { email, url } = req.body;
  if (!email) throw new AppError(400, 'Missing email address.');
  if (!url) throw new AppError(400, 'Missing url, where to link the token.');

  // initially just actie users gets searched. Reactivation is one exception
  let isActive = true;
  if (req.originate === 'reactivateProfile') isActive = false;

  // search for the user
  const user = await User.findOne({ email, isActive });
  if (!user) throw new AppError(404, 'User with that email is not found.');

  // add a reset token to the user and save it
  const token = user.addResetPasswordToken();
  await user.save();

  // set email credentials
  const subject = 'Recovery link';
  const html = emailMarkup[req.originate](url, token);
  const text = convert(html);

  //send email
  const mail = new Email(user.email);
  await mail.send(subject, text, html);

  // return response
  res.status(200).json({
    status: 'success',
    data: {
      message: req.resMessage,
    },
  });
});

// Middlewares (no endpoint)
////
exports.authenticate = catchAsync(async (req, res, next) => {
  // get the token
  const token = req.cookies?.jwt;
  if (!token) throw new AppError(403, 'You need to be logged in to access.');

  // verify token
  const tokenData = await _verifyJWT(token);

  // check if user still exists
  const _id = new ObjectId(`${tokenData.id}`);
  const user = await User.findOne({ _id, isActive: true }, '+passwordChangedAt +email');

  if (!user) throw new AppError(401, 'User does no longer exists. Please log in again.');

  // was the password after token issue date changed?
  if (user.passwordChangedAt > tokenData.iat * 1000)
    throw new AppError(401, 'The user recently changed his/her password. Please log in again.');

  // access granted
  delete user.passwordChangedAt;
  req.user = user;
  next();
});

// Identificate user
exports.identificateUser = catchAsync(async (req, res, next) => {
  // get the token
  const token = req.cookies?.jwt;
  if (!token) return next();

  // verify token
  const tokenData = await _verifyJWT(token);

  // check if user still exists and if the password changed after token issue date
  const _id = new ObjectId(`${tokenData.id}`);
  const user = await User.findOne({ _id, isActive: true }, '+passwordChangedAt +email');
  if (!user || user.passwordChangedAt > tokenData.iat * 1000) return next();

  // user is identified
  delete user.passwordChangedAt;
  req.user = user;
  next();
});

// Restriction of routes to some roles
exports.restrictedTo = function (...roles) {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) throw new AppError(403, 'You are not permitted to use this route.');
    next();
  });
};

// Middlewares for routes that needs a recovering password
////
exports.forgotPassword = catchAsync(async (req, res, next) => {
  req.resMessage = 'Message sent on your email with the password resert link.';
  req.originate = 'forgotPassword';

  next();
});

exports.reactivateProfile = catchAsync(async (req, res, next) => {
  req.resMessage = 'Reactivation link is sent to your email address.';
  req.originate = 'reactivateProfile';

  next();
});
