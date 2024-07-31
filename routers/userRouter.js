const express = require("express");
const userController = require("./../controller/userController");

const router = express.Router();

router.route("/signup").post(userController.signupUser);
router.route("/login").post(userController.loginUser);

module.exports = router;
