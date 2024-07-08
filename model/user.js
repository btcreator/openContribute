const mongoose = require("mongoose");
const { createHash } = require("crypto");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validator: function () {},
  },
  password: {
    type: String,
    required: true,
  },
  alias: String,
  name: {
    type: String,
    validate: {
      validator: function (val) {
        return val.indexOf(" ") > 1;
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
});

userSchema.pre("save", function (next) {
  const hash = createHash("sha256");
  hash.update(this.password);
  this.password = hash.digest("hex");
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
