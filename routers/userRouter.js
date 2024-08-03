const express = require('express');
const authController = require('./../controller/authentication/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router
    .route('/changeMyPassword')
    .patch(authController.authenticate, authController.changeMyPassword);

module.exports = router;
