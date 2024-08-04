const mongoose = require("mongoose");
const AppError = require("./../utils/appError");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// When the retrived documnet is converted to Object or JSON format, the password gets excluded from the document (see Schema options)
const excludePassword = function (doc, ret) {
  delete ret.password;
  return ret;
};

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter an email address."],
      unique: true,
      validate: {
        validator: function (email) {
          const reg =
            /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
          return reg.test(email);
        },
        message: "Please provide a valid email address.",
      },
    },
    password: {
      type: String,
      required: [true, "Please enter a password."],
      minlength: 8,
    },
    alias: String,
    name: {
      type: String,
      validate: {
        validator: function (name) {
          return name.indexOf(" ") > 1;
        },
        message: "Please provide a valid name.",
      },
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetTokenExpire: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
  },
  {
    virtuals: {
      confirmPassword: String,
    },
    toObject: {
      transform: excludePassword,
    },
    toJSON: {
      transform: excludePassword,
    },
  }
);

// Static methods
////
userSchema.statics.checkPassword = async (
  toVerifyPassword,
  encryptedPassword
) => await bcrypt.compare(toVerifyPassword, encryptedPassword);

// Instance methods
////
userSchema.methods.addResetPasswordToken = () => {
  // create token and an expiration date
  const token = crypto.randomBytes(32).toString("hex");
  const expDate = Date.now() + 15 * 60 * 1000;

  // save it to the instance
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetTokenExpire = new Date(expDate);

  return token;
};

// Hooks (Middlewares)
////
userSchema.pre("save", async function (next) {
  // if the password is modified, created, changed
  if (this.isModified("password")) {
    // there must be a confirmation of the validity of the password
    if (this.password !== this.confirmPassword) {
      const msg = this.confirmPassword
        ? "Your password does not match with confirm password"
        : "Please confirm your password";
      return next(new AppError(401, msg));
    }

    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
