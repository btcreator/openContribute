const User = require("../../model/user");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const jwt = require("jsonwebtoken");
const Email = require("./../../utils/mail");
const { convert } = require("html-to-text");
const { serverLog } = require("../../utils/helpers");
const { promisify } = require("util");
const mongoose = require("mongoose");

// Generate and set jwt token on response cookies or destroy token cookie
const setJWTandSend = async (res, statusCode, resPayload, jwtPayload = {}) => {
  const options = { httpOnly: true, secure: true };

  jwtPayload.iat = Date.now();
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

// Special case functions - No Middlewares
////
//Log out the user after a delete operation - reset cookie
exports.logDeletedMeOutAndSend = async (res) => {
  await setJWTandSend(res, 204, {});
};

// Authentication routes
////
exports.signup = catchAsync(async (req, res) => {
  // destructuring, so no one can inject suspicious data to database
  const { email, password, confirmPassword } = req.body;

  // look first if inactive user exists with that email
  const inactiveUser = await User.findOne({ email, isActive: false });
  // when yes, reactivate user
  if (inactiveUser) {
    inactiveUser.isActive = true;
    inactiveUser.password = password;
    inactiveUser.confirmPassword = confirmPassword;
  }

  // reactivate user or create new user in DB
  const user = await (inactiveUser
    ? inactiveUser.save()
    : User.create({ email, password, confirmPassword }));

  await setJWTandSend(res, 201, { user }, { id: user._id });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // check for incoming data presence
  if (!email || !password)
    throw new AppError(400, "Please enter an email and password to log in.");

  // find user
  const user = await User.findOne({ email, isActive: true });

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
    throw new AppError(400, "Please provide and confirm your new password.");

  // confirm password equalty
  if (!(await User.checkPassword(req.body.password, user.password)))
    throw new AppError(401, "Wrong password.");

  // set new password
  user.password = newPassword;
  user.confirmPassword = confirmPassword;

  await user.save();

  await setJWTandSend(res, 200, { user }, { id: user._id });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  // check if the requied data is sent with the request
  const { email, url } = req.body;
  if (!email) throw new AppError(400, "Missing email address.");
  if (!url) throw new AppError(400, "Missing url, where to link the token.");

  // search for the user
  const user = await User.findOne({ email });
  if (!user) throw new AppError(404, "User with that email is not found.");

  // add a reset token to the user and save it
  const token = user.addResetPasswordToken();
  await user.save();

  // create link with token
  const subject = "Reset password link";
  const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dcdcdc; border-radius: 5px;">
  <h2 style="color: #333333; text-align: center;">Reset Your Password</h2>
  <p style="color: #333333;">Hello,</p>
  <p style="color: #333333;">You recently requested to reset your password. Click the button below to reset it:</p>
  <p style="text-align: center;">
    <a href="https://${url}?token=${token}" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #007bff; border-radius: 5px; text-decoration: none; font-weight: bold;">Reset Password</a>
  </p>
  <p style="color: #333333;">Your reset password token expires in <b>15 min.</b></p>
  <p style="color: #333333;">If you didn't request a password reset, please ignore this email.</p>
  <div style="margin-top: 30px; text-align: center; border-top: 1px solid #dcdcdc; padding-top: 20px;">
    <p style="color: #555555;">Thank you,</p>
    <p style="color: #555555;"><strong>The OpenContribute Team</strong></p>
  </div>
</div>`;
  const text = convert(html);

  //send email
  const mail = new Email(email);
  await mail.send(subject, text, html);

  // return response
  res.status(200).json({
    status: "success",
    data: {
      message: "Message sent on your email with the password resert link",
    },
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  // get token - from query or body - allowing both for API implementor
  let token = req.query.token;
  if (!token) token = req.body.token;

  // get the rest of the data...
  const { password, confirmPassword } = req.body;

  // find user with token
  const passwordResetToken = User.hashToken(token);
  const user = await User.findOne(
    { passwordResetToken, isActive: true },
    "+resetTokenExpire"
  );

  // no user, no chocolate ;)
  if (!user)
    throw new AppError(
      401,
      "We could not find your request, please try again or request for reset password again."
    );

  // token expiration check
  const expired = user.resetTokenExpire < Date.now();

  // when everithing looks right, set new password - validation and hashing happens during the save process
  if (!expired) {
    user.password = password;
    user.confirmPassword = confirmPassword;
  }

  // remove exp date and token - because its expired, or password gets reset
  user.resetTokenExpire = undefined;
  user.passwordResetToken = undefined;

  // save changes in db
  await user.save();

  // if token expired, throw error
  if (expired)
    throw new AppError(
      403,
      "Your token is expired. Please request a new reset password token."
    );

  // response message
  res.status(200).json({
    status: "success",
    data: {
      message: "Password changed successfully.",
    },
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
    throw new AppError(401, "Invalid token. Please log in again.");
  });

  // check if user still exists
  const _id = new mongoose.Types.ObjectId(`${tokenData.id}`);
  const user = await User.findOne(
    { _id, isActive: true },
    "+passwordChangedAt"
  );

  if (!user)
    throw new AppError(401, "User does no longer exists. Please log in again.");

  // was the password after token issue date changed?
  if (user.passwordChangedAt > tokenData.iat)
    throw new AppError(
      401,
      "The user recently changed his/her password. Please log in again."
    );

  // access granted
  delete user.passwordChangedAt;
  req.user = user;
  next();
});

// Restriction to some roles
exports.restrictedTo = function (...roles) {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new AppError(403, "You are not permitted to use this route.");
    next();
  });
};
