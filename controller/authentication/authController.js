const User = require('../../model/user');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const jwt = require('jsonwebtoken');
const Email = require('../../utils/email');
const { convert } = require('html-to-text');
const { serverLog } = require('../../utils/helpers');
const { promisify } = require('util');
const emailMarkup = require('../../utils/emailMarkup');
const mongoose = require('mongoose');

const cookieOptions = { httpOnly: true, secure: true };

// Token related functions
////
// Generate jwt token
const signJWT = (jwtPayload) => {
  jwtPayload.iat = Date.now();
  return promisify(jwt.sign)(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Verify jwt token
const verifyJWT = (token) =>
  promisify(jwt.verify)(token, process.env.JWT_SECRET).catch((err) => {
    serverLog(`Security log: ${err.name} - ${err.message}`);
    throw new AppError(401, 'Invalid token. Please log in again.');
  });

// Special case functions - No Middlewares, No Routes
////
// Log out the user after a delete operation - reset cookie
exports.logDeletedMeOutAndSend = async (res) => {
  res.clearCookie('jwt', cookieOptions);
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
  const token = await signJWT({ id: user._id });
  res.cookie('jwt', token, cookieOptions);

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // optional for redirecting after log in
  const continueTo = req.body.continue || req.query.continue;

  // check for incoming data presence
  if (!email || !password) throw new AppError(400, 'Please enter an email and password to log in.');

  // find user
  const user = await User.findOne({ email, isActive: true });

  // check if user found and if the password is correct
  if (!user || !(await User.checkPassword(password, user.password)))
    throw new AppError(401, 'Wrong email or password.');

  // create jwt token and set cookie
  const token = await signJWT({ id: user._id });
  res.cookie('jwt', token, cookieOptions);

  // check for redirection (when user initially wanted a route that needs authentication, then giving the possibility to redirect the user to that route for API implementors)
  if (continueTo) {
    try {
      // validate if the redirection follows to the same host (security reason - malicious link injection)
      const originHostname = new URL(req.get('origin')).hostname;
      const hostname = new URL(continueTo).hostname;
      if (originHostname === hostname) return res.redirect(continueTo);
    } catch (err) {
      // should nothing happen, and send a respons without redirecting
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.logout = catchAsync(async (req, res) => {
  res.clearCookie('jwt', cookieOptions);

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

  // create jwt token and set cookie
  const token = await signJWT({ id: user._id });
  res.cookie('jwt', token, cookieOptions);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  // get token - from query or body - allowing both for API implementor
  const token = req.body.token || req.query.token;

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
  const token = req.cookies.jwt;
  if (!token) throw new AppError(403, 'You need to be logged in to access.');

  // verify token
  const tokenData = await verifyJWT(token);

  // check if user still exists
  const _id = new mongoose.Types.ObjectId(`${tokenData.id}`);
  const user = await User.findOne({ _id, isActive: true }, '+passwordChangedAt');

  if (!user) throw new AppError(401, 'User does no longer exists. Please log in again.');

  // was the password after token issue date changed?
  if (user.passwordChangedAt > tokenData.iat)
    throw new AppError(401, 'The user recently changed his/her password. Please log in again.');

  // access granted
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
