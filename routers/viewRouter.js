const express = require('express');
const { identificateUser, authenticate } = require('./../controller/authentication/authController');
const viewController = require('./../controller/viewController');

const router = express.Router();

router.use(viewController.alertMsgHandler);

router.get('/', identificateUser, viewController.getHome);
router.get('/login', identificateUser, viewController.login);
router.get('/search');
router.get('/project/:slug', identificateUser, viewController.showProject);

router.use(authenticate);
router.get('/myProfile', viewController.myProfile);
router.get('/myContributions', viewController.myContributions);
router.get('/myProjects', viewController.myProjects);

// router.get('/project-create');
// router.get("/project-update/:slug");

module.exports = router;
