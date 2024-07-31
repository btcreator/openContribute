const User = require("./../model/user");
const jwt = require("jsonwebtoken");

const setJWTcookie = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.cookie("jwt", token, { httpOnly: true, secure: true });
};

exports.signupUser = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const user = await User.create({ email, password, confirmPassword });
    setJWTcookie(user._id, res);

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await User.checkPassword(password, user.password)))
      throw new Error("Wrong email or password.");
    setJWTcookie(user._id, res);

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
