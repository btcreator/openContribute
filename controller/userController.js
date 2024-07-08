const User = require("./../model/user");

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};
