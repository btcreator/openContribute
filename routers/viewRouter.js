const express = require('express');
const { identificateUser, authenticate } = require('./../controller/authentication/authController');
const viewController = require('./../controller/viewController');

const router = express.Router();

router.get('/', identificateUser, viewController.getHome);
router.get('/login', identificateUser, viewController.login);
router.get('/search');
router.get('/profile');

// router.get('/project/:slug');
// router.get('/project-create');
// router.get("/project-update/:slug");

module.exports = router;
