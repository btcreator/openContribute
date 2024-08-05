const express = require("express");
const authController = require("./../controller/authentication/authController");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword").patch(authController.resetPassword);

router
  .route("/changeMyPassword")
  .patch(authController.authenticate, authController.changeMyPassword);

module.exports = router;
