const express = require('express');
const { checkId } = require('./../utils/helpers');
const { authenticate, restrictedTo } = require('./../controller/authentication/authController');
const projectController = require('../controller/projectController');

const router = express.Router();

router.route('/resources/info').get(projectController.resourceInfo);
router.route('/search').get(projectController.getSearchResults);

router.route('/myProjects').get(authenticate, projectController.myProjects);

router.route('/:id').get(checkId, projectController.getProject);
router.route('/:slug').get(projectController.getProject);

// After this point an authentication is needed
router.use(authenticate);

router.route('/myProject').post(projectController.createMyProject);
router
  .route('/myProject/:id')
  .all(checkId)
  .patch(projectController.updateMyProject)
  .delete(projectController.deleteMyProject);

// After this point is the restricted area for admins
router.use(restrictedTo('admin'));

router.route('/').get(projectController.getAllProjects).post(projectController.createProject);
router.route('/:id').all(checkId).patch(projectController.updateProject).delete(projectController.deleteProject);

module.exports = router;
