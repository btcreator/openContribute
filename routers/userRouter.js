const express = require("express");
const userController = require(".//../controller/userController");
const authController = require("./../controller/authentication/authController");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword").patch(authController.resetPassword);

// After this point an authentication is needed
router.use(authController.authenticate);

router.route("/changeMyPassword").patch(authController.changeMyPassword);

// After this point is the restricted area for admins
router.use(authController.adminAreaRestriction);

router
  .route("/")
  .post(userController.createUser)
  .get(userController.findAllUsers);

router
  .route("/:id")
  .get(userController.findUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
