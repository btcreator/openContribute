const express = require('express');
const userController = require('./../controller/userController');
const { checkId } = require('./../utils/helpers');
const authController = require('./../controller/authentication/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/forgotPassword').post(authController.forgotPassword, authController.passwordRecoveryProcess);
router.route('/resetPassword').patch(authController.resetPassword);
router.route('/reactivateProfile').post(authController.reactivateProfile, authController.passwordRecoveryProcess);

// After this point an authentication is needed
router.use(authController.authenticate);

router.route('/changeMyPassword').patch(authController.changeMyPassword);
router
  .route('/myProfile')
  .get(userController.myProfile)
  .patch(userController.updateMyProfile)
  .delete(userController.deleteMyProfile);

// After this point is the restricted area for admins
router.use(authController.restrictedTo('admin'));

router.route('/').post(userController.createUser).get(userController.findAllUsers);

router
  .route('/:id')
  .all(checkId) // check the id and redirect to next middleware or route
  .get(userController.findUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
